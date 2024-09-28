import { compare } from "bcrypt";
import { NEW_REQUEST, REFETCH_CHATS } from "../constants/events.js";
import { getOtherMember } from "../lib/helper.js";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Event } from "../models/Events.js";
import { Story } from "../models/story.js";
import {
  cookieOptions,
  emitEvent,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/features.js";
import { ErrorHandler } from "../utils/utility.js";
import { Course } from "../models/courses.js";

// Create a new user and save it to the database and save token in cookie
const newUser = TryCatch(async (req, res, next) => {
  const { name, studentId, password, institutename } = req.body;
  const files = req.files.avatar;
  const file = req.files.idImage;
  if (!files || !file) {
    return next(new ErrorHandler("Please Upload Avatar & idImage"));
  }

  const result = await uploadFilesToCloudinary([files]);
  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  const image = await uploadFilesToCloudinary([file]);
  const idImage = {
    public_id: image[0].public_id,
    url: image[0].url,
  };
  const user = await User.create({
    name,
    idImage,
    institutename,
    studentId,
    password,
    avatar,
  });

  sendToken(res, user, 201, "Welcome to unimedia");
});

// Login user and save token in cookie
const login = TryCatch(async (req, res, next) => {
  const { studentId, password } = req.body;

  const user = await User.findOne({ studentId }).select("+password");

  if (!user)
    return next(new ErrorHandler("Invalid StudentId or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid StudentId or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User not found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("unimedia-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name = "" } = req.query;
  if (!name.trim()) {
    return res.status(200).json({
      success: true,
      users: [],
    });
  }
  // Finding All my chats
  const myChats = await Chat.find({ groupChat: false, members: req.user });

  //  extracting All Users from my chats means friends or people I have chatted with
  const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

  // Finding all users except me and my friends
  const allUsersExceptMeAndFriends = await User.find({
    _id: { $nin: allUsersFromMyChats },
    name: { $regex: name, $options: "i" },
  });

  // Modifying the response
  const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
    _id,
    name,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});

const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId } = req.body;

  const request = await Request.findOne({
    $or: [
      { sender: req.user, receiver: userId },
      { sender: userId, receiver: req.user },
    ],
  });

  if (request) return next(new ErrorHandler("Request already sent", 400));

  await Request.create({
    sender: req.user,
    receiver: userId,
  });

  emitEvent(req, NEW_REQUEST, [userId]);

  return res.status(200).json({
    success: true,
    message: "Friend Request Sent",
  });
});

const acceptFriendRequest = TryCatch(async (req, res, next) => {
  const { requestId, accept } = req.body;

  const request = await Request.findById(requestId)
    .populate("sender", "name")
    .populate("receiver", "name");

  if (!request) return next(new ErrorHandler("Request not found", 404));

  if (request.receiver._id.toString() !== req.user.toString())
    return next(
      new ErrorHandler("You are not authorized to accept this request", 401)
    );

  if (!accept) {
    await request.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Friend Request Rejected",
    });
  }

  const members = [request.sender._id, request.receiver._id];

  await Promise.all([
    Chat.create({
      members,
      name: `${request.sender.name}-${request.receiver.name}`,
    }),
    request.deleteOne(),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Friend Request Accepted",
    senderId: request.sender._id,
  });
});

const getMyNotifications = TryCatch(async (req, res) => {
  const requests = await Request.find({ receiver: req.user }).populate(
    "sender",
    "name avatar"
  );

  const allRequests = requests.map(
    ({ _id, sender, groupname, isgroup, studentId, chatid }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
      },
      groupname,
      isgroup,
      studentId,
      chatid,
    })
  );

  return res.status(200).json({
    success: true,
    allRequests,
  });
});

const getMyFriends = TryCatch(async (req, res) => {
  const chatId = req.query.chatId;

  const chats = await Chat.find({
    members: req.user,
    groupChat: false,
  }).populate("members", "name avatar");

  const friends = chats.map(({ members }) => {
    const otherUser = getOtherMember(members, req.user);

    return {
      _id: otherUser._id,
      name: otherUser.name,
      avatar: otherUser.avatar.url,
    };
  });

  if (chatId) {
    const chat = await Chat.findById(chatId);

    const availableFriends = friends.filter(
      (friend) => !chat.members.includes(friend._id)
    );

    return res.status(200).json({
      success: true,
      friends: availableFriends,
    });
  } else {
    return res.status(200).json({
      success: true,
      friends,
    });
  }
});
const getUsers = TryCatch(async (req, res) => {
  const { name = "" } = req.query;
  if (!name.trim()) {
    return res.status(200).json({
      success: true,
      users: [],
    });
  }
  const result = await User.find({ name: new RegExp(name, "i") });
  const users = result.map(({ _id, studentId, name, avatar }) => ({
    _id,
    name,
    studentId,
    avatar: avatar.url,
  }));
  return res.status(200).json({
    success: true,
    users,
  });
});
const findUsers = TryCatch(async (req, res) => {
  const { name = "", chatid = "" } = req.query;
  const chat = await Chat.findById(chatid).select("members");
  if (!chat) {
    return res.status(404).json({ success: false, message: "Chat not found" });
  }
  const memberIds = chat.members;
  const result = await User.find({
    name: new RegExp(name, "i"),
    _id: { $nin: memberIds },
  });
  const users = result.map(({ _id, studentId, name, avatar }) => ({
    _id,
    name,
    studentId,
    avatar: avatar.url,
  }));

  return res.status(200).json({
    success: true,
    users,
  });
});
const createPost = TryCatch(async (req, res) => {
  const { content, name, creatorid, avatar } = req.body;
  const files = req.files.attachments || [];
  if (files.length > 1)
    return next(new ErrorHandler("Files Can't be more than 1", 400));
  const attachments = await uploadFilesToCloudinary([files]);
  await Post.create({
    name,
    content,
    attachments: attachments[0],
    creatorid,
    avatar,
  });
  res.status(200).json({
    success: true,
    message: "Post created succesfully",
  });
});
const allevents = TryCatch(async (req, res) => {
  const events = await Event.find({});
  return res.status(200).json({
    success: true,
    events,
  });
});
const getPosts = TryCatch(async (req, res) => {
  const { page = "1" } = req.query;
  const pageSize = 2;
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ error: "Invalid page number" });
  }

  const posts = await Post.find({});
  const totalPosts = await Post.countDocuments({});
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedPosts = posts.slice(startIndex, endIndex);

  res.status(200).json({
    success: true,
    paginatedPosts,
    totalPosts,
  });
});
const admin = TryCatch(async (req, res) => {
  const { userid, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (chat.creator.equals(userid)) {
    chat.adminChat = true;
    await chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members, { chatId });
    return res.status(200).json({
      success: true,
      message: "Now only admin can send message into the group",
    });
  } else {
    return next(
      new ErrorHandler("You are not allowed to change this setting", 400)
    );
  }
});
const alluser = TryCatch(async (req, res) => {
  const { userid, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  if (chat.creator.equals(userid)) {
    chat.adminChat = false;
    await chat.save();
    emitEvent(req, REFETCH_CHATS, chat.members, { chatId });
    return res.status(200).json({
      success: true,
      message: "Now all user can send message into the group",
    });
  } else {
    return next(
      new ErrorHandler("You are not allowed to change this setting", 400)
    );
  }
});
const status = TryCatch(async (req, res) => {
  const { userId, chatId } = req.body;
  const chat = await Chat.findById(chatId);
  const val = chat.adminChat;
  if (val) {
    if (chat.creator.equals(userId)) {
      return res.status(200).json({ success: true, a: true });
    } else {
      return res.status(200).json({ success: true, a: false });
    }
  } else {
    return res.status(200).json({ success: true, a: true });
  }
});
const getCourses = TryCatch(async (req, res) => {
  const courses = await Course.find({});

  res.status(200).json({
    success: true,
    courses,
  });
});
const singlegroup = TryCatch(async (req, res) => {
  const chat = await Chat.aggregate([
    { $match: { groupChat: true } },
    { $sample: { size: 1 } },
  ]);
  const a = {
    _id: chat[0]._id,
    name: chat[0].name,
    url: chat[0].Image.url,
    creator: chat[0].creator,
  };
  return res.status(200).json({
    success: true,
    a,
  });
});
const request = TryCatch(async (req, res) => {
  const { name, studentId, groupname, chatid } = req.body;
  const chat = await Chat.findOne({ _id: chatid, name: groupname });
  const creator = chat.creator;
  await Request.create({
    name,
    studentId,
    groupname,
    sender: req.user,
    receiver: creator,
    isgroup: true,
    chatid: chatid,
  });
  emitEvent(req, NEW_REQUEST, [creator]);
  return res.status(200).json({
    success: true,
    message: "Request sent succesfully",
  });
});
const delrequest = TryCatch(async (req, res) => {
  const { deny = "" } = req.query;
  await Request.findByIdAndDelete(deny);
  return res.status(200).json({
    success: true,
    message: "Request Rejected successfully",
  });
});
const searchGroup = TryCatch(async (req, res) => {
  const { name = "" } = req.query;
  if (!name.trim()) {
    return res.status(200).json({
      success: true,
      group: [],
    });
  }
  const group = await Chat.find({
    name: { $regex: name, $options: "i" },
    groupChat: true,
  }).select("_id name Image.url creator");

  return res.status(200).json({
    success: true,
    group,
  });
});
const getStory = TryCatch(async (req, res) => {
  const pipeline = [
    { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
    {
      $group: {
        _id: "$type", // Group by the type field
        doc: { $first: "$$ROOT" }, // Get the first document in each group
      },
    },
    { $replaceRoot: { newRoot: "$doc" } }, // Replace the root with the document
  ];
  const newestDocuments = await Story.aggregate(pipeline);
  return res.status(200).json({
    success: true,
    newestDocuments,
  });
});
const singleEvent = TryCatch(async (req, res) => {
  const event = await Event.aggregate([{ $sample: { size: 1 } }]);
  return res.status(200).json({
    success: true,
    event,
  });
});
const searchPost = TryCatch(async (req, res) => {
  const { name = "" } = req.query;
  if (!name.trim()) {
    return res.status(200).json({
      success: true,
      posts: [],
    });
  }
  const posts = await Post.find({
    name: { $regex: name, $options: "i" },
  })
    .select("_id name creatorid ispinned createdAt")
    .sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    posts,
  });
});
const pinnedPosts = TryCatch(async (req, res) => {
  const { page = "1" } = req.query;
  const pageSize = 2;
  const pageNumber = parseInt(page, 10);

  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({ error: "Invalid page number" });
  }

  const totalPosts = await Post.countDocuments({ ispinned: true });
  const posts = await Post.find({ ispinned: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    paginatedPosts: posts,
    totalPosts,
  });
});
const getStories = TryCatch(async (req, res) => {
  const { type = "", page = 1 } = req.query;
  const perPage = 1;
  const offset = (page - 1) * perPage;
  const story = await Story.findOne({ type })
    .sort({ createdAt: -1 })
    .skip(offset)
    .limit(1);
  res.status(200).json({ success: true, story });
});
const singleCourse=TryCatch(async(req,res)=>{
  const course = await Course.aggregate([{ $sample: { size: 1 } }]);
  return res.status(200).json({
    success: true,
    course,
  });
});
export {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
  getUsers,
  findUsers,
  createPost,
  allevents,
  getPosts,
  admin,
  alluser,
  status,
  getCourses,
  singlegroup,
  request,
  delrequest,
  searchGroup,
  getStory,
  singleEvent,
  searchPost,
  pinnedPosts,
  getStories,
  singleCourse,
};

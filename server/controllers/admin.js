import jwt from "jsonwebtoken";
import { TryCatch } from "../middlewares/error.js";
import { Chat } from "../models/chat.js";
import { Message } from "../models/message.js";
import { Event } from "../models/Events.js";
import { Access } from "../models/access.js";
import { User } from "../models/user.js";
import { Course } from "../models/courses.js";
import { Story } from "../models/story.js";
import { Post } from "../models/post.js";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions, uploadFilesToCloudinary } from "../utils/features.js";
import { adminSecretKey } from "../app.js";
import mongoose from "mongoose";
const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  const isMatched = secretKey === adminSecretKey;

  if (!isMatched) return next(new ErrorHandler("Invalid Admin Key", 401));

  const token = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("unimedia-admin-token", token, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 15,
    })
    .json({
      success: true,
      message: "Authenticated Successfully, Welcome BOSS",
    });
});

const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("unimedia-admin-token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

const getAdminData = TryCatch(async (req, res, next) => {
  return res.status(200).json({
    admin: true,
  });
});

const allUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ name, studentId, avatar, _id }) => {
      const [groups, friends] = await Promise.all([
        Chat.countDocuments({ groupChat: true, members: _id }),
        Chat.countDocuments({ groupChat: false, members: _id }),
      ]);

      return {
        name,
        studentId,
        avatar: avatar.url,
        _id,
        groups,
        friends,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    users: transformedUsers,
  });
});

const allChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ members, _id, groupChat, name, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        groupChat,
        name,
        avatar: members.slice(0, 3).map((member) => member.avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    status: "success",
    chats: transformedChats,
  });
});

const allMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      attachments,
      content,
      createdAt,
      chat: chat._id,
      groupChat: chat.groupChat,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  return res.status(200).json({
    success: true,
    messages: transformedMessages,
  });
});

const getDashboardStats = TryCatch(async (req, res) => {
  const [groupsCount, usersCount, messagesCount, totalChatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments(),
      Message.countDocuments(),
      Chat.countDocuments(),
    ]);

  const today = new Date();

  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: {
      $gte: last7Days,
      $lte: today,
    },
  }).select("createdAt");

  const messages = new Array(7).fill(0);
  const dayInMiliseconds = 1000 * 60 * 60 * 24;

  last7DaysMessages.forEach((message) => {
    const indexApprox =
      (today.getTime() - message.createdAt.getTime()) / dayInMiliseconds;
    const index = Math.floor(indexApprox);

    messages[6 - index]++;
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalChatsCount,
    messagesChart: messages,
  };

  return res.status(200).json({
    success: true,
    stats,
  });
});

const evEnts = TryCatch(async (req, res, next) => {
  const {
    name,
    description,
    date,
    type,
    onlineDetails,
    offlineDetails,
    fee,
    organizer,
    time,
  } = req.body;
  const img = req.file;
  if (!img) {
    return next(new ErrorHandler("Please choose image for event"));
  }
  const result = await uploadFilesToCloudinary([[img]]);
  const Image = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  await Event.create({
    name,
    description,
    date,
    type,
    onlineDetails,
    offlineDetails,
    fee,
    organizer,
    time,
    Image,
  });
  return res.status(200).json({
    success: true,
    message: "Event Added",
  });
});
const grantaccess = TryCatch(async (req, res) => {
  const { name, userid } = req.body;
  await Access.create({ name, userid });
  return res.status(201).json({
    success: true,
    message: "Access Granted succesfully",
  });
});
const courSes = TryCatch(async (req, res) => {
  const { name, description, startDate, endDate, instructor, fee, type } =
    req.body;
  const img = req.file;
  if (!img) {
    return next(new ErrorHandler("Please choose image for course"));
  }
  const result = await uploadFilesToCloudinary([[img]]);
  const Image = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  await Course.create({
    name,
    description,
    startDate,
    endDate,
    instructor,
    fee,
    type,
    Image,
  });
  return res.status(200).json({
    success: true,
    message: "Course Added",
  });
});
const searching = TryCatch(async (req, res) => {
  const { userid } = req.body;
  const exist = await Access.findOne({ userid: { $in: [userid] } });
  if (exist) {
    return res.status(200).json({ a: true });
  } else {
    return res.status(200).json({ a: false });
  }
});
const removeaccess = TryCatch(async (req, res) => {
  const { userid } = req.body;
  await Access.findOneAndDelete({ userid: userid });
  res.status(200).json({
    success: true,
    message: "denied access succesfully",
  });
});
const stories = TryCatch(async (req, res, next) => {
  const { description, link, type } = req.body;
  const abcd = req.files.attach[0];
  if (!abcd) {
    return next(new ErrorHandler("Please choose file for story"));
  }
  if (abcd.length > 1)
    return next(new ErrorHandler("Files Can't be more than 1", 400));
  const result = await uploadFilesToCloudinary([[abcd]]);
  const attachments = {
    public_id: result[0].public_id,
    url: result[0].url,
  };
  await Story.create({
    description,
    link,
    type,
    attachments,
  });
  return res.status(200).json({
    success: true,
    message: "Story Added",
  });
});
const pinpost = TryCatch(async (req, res, next) => {
  const { postid = "" } = req.query;
  const post = await Post.findById(postid);
  post.ispinned = true;
  await post.save();
  return res.status(200).json({
    success: true,
    message: "Post pinned succesfully",
  });
});
const unpinpost = TryCatch(async (req, res, next) => {
  const { postid = "" } = req.query;
  const post = await Post.findById(postid);
  post.ispinned = false;
  await post.save();
  return res.status(200).json({
    success: true,
    message: "Post unpinned succesfully",
  });
});
export {
  allUsers,
  allChats,
  allMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getAdminData,
  evEnts,
  courSes,
  grantaccess,
  searching,
  removeaccess,
  stories,
  pinpost,
  unpinpost,
};

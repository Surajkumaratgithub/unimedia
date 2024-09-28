import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  getUsers,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
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
} from "../controllers/user.js";
import {
  acceptRequestValidator,
  loginValidator,
  registerValidator,
  sendRequestValidator,
  validateHandler,
  postAttachmentsValidator,
  requestValidator,
} from "../lib/validators.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { singleAvatarAndIdImage, postImage} from "../middlewares/multer.js";

const app = express.Router();

app.post("/new", singleAvatarAndIdImage,registerValidator(), validateHandler, newUser);
app.post("/login", loginValidator(), validateHandler, login);
app.post("/knowstatus",status);
app.get("/getgroup",singlegroup);
app.get("/getevent",singleEvent);
app.get("/singlecourse",singleCourse);

// After here user must be logged in to access the routes

app.use(isAuthenticated);

app.get("/me", getMyProfile);

app.get("/logout", logout);

app.get("/search", searchUser);
app.get("/searchgrp", searchGroup);
app.get("/searchpost", searchPost);
app.get("/getuser",getUsers);
app.get("/getstory",getStory);
app.get("/finduser",findUsers);
app.get("/event",allevents);
app.get("/getpost",getPosts);
app.get("/getstories",getStories);
app.get("/pinnedpost",pinnedPosts);
app.get("/delrequest",delrequest);
app.get("/getcourse",getCourses);
app.post("/adminonly",admin);
app.post("/alluser",alluser);
app.post("/request",requestValidator(),validateHandler,request);
app.post("/createpost",postImage,
postAttachmentsValidator(),
validateHandler,
createPost);
app.put(
  "/sendrequest",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);

app.put(
  "/acceptrequest",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

app.get("/notifications", getMyNotifications);

app.get("/friends", getMyFriends);

export default app;

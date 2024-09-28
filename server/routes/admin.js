import express from "express";
import {
  adminLogin,
  adminLogout,
  allChats,
  allMessages,
  allUsers,
  courSes,
  evEnts,
  getAdminData,
  getDashboardStats,
  grantaccess,
  searching,
  removeaccess,
  stories,
  pinpost,
  unpinpost,
} from "../controllers/admin.js";
import {
  accessValidator,
  adminLoginValidator,
  eventCreateValidator,
  validateHandler,
  searchValidator,
  courseCreateValidator,
  storyCreateValidator,
} from "../lib/validators.js";
import { adminOnly } from "../middlewares/auth.js";
import { attachmentsMulter, singleImage, storyImage } from "../middlewares/multer.js";

const app = express.Router();

app.post("/verify", adminLoginValidator(), validateHandler, adminLogin);

app.get("/logout", adminLogout);

app.post("/find", searchValidator(), validateHandler, searching);
// Only Admin Can Accecss these below Routes

app.use(adminOnly);

app.get("/", getAdminData);

app.get("/users", allUsers);
app.get("/chats", allChats);
app.get("/messages", allMessages);
app.get("/unpinpost",unpinpost);
app.get("/pinpost",pinpost);
app.post(
  "/event",
  singleImage,
  eventCreateValidator(),
  validateHandler,
  evEnts
);
app.post(
  "/story",
  storyImage,
  storyCreateValidator(),
  validateHandler,
  stories
);
app.post("/courses",singleImage,courseCreateValidator(),validateHandler, courSes);
app.get("/stats", getDashboardStats);
app.post("/removeaccess", searchValidator(), validateHandler, removeaccess);
app.post("/access", accessValidator(), validateHandler, grantaccess);
export default app;

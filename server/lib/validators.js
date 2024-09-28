import { body, param, validationResult } from "express-validator";
import { ErrorHandler } from "../utils/utility.js";
import mongoose from "mongoose";
const validateHandler = (req, res, next) => {
  const errors = validationResult(req);

  const errorMessages = errors
    .array()
    .map((error) => error.msg)
    .join(", ");

  if (errors.isEmpty()) return next();
  else next(new ErrorHandler(errorMessages, 400));
};

const registerValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("studentId", "Please Enter StudentId").notEmpty(),
  body("institutename", "Please Enter institutename").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];
const requestValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("studentId", "Please Enter StudentId").notEmpty(),
  body("groupname", "Please Enter Groupname").notEmpty(),
];
const loginValidator = () => [
  body("studentId", "Please Enter StudentId").notEmpty(),
  body("password", "Please Enter Password").notEmpty(),
];
const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};
const newGroupValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("members", "Members must be an array")
    .isArray({ min: 2, max: 100 })
    .withMessage("Members must be 2-100"),
  body("members.*", "Each member must be a valid ObjectId").custom(
    isValidObjectId
  ),
];

const addMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("members")
    .notEmpty()
    .withMessage("Please Enter Members")
    .isArray({ min: 1, max: 97 })
    .withMessage("Members must be 1-97"),
];

const removeMemberValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
  body("userId", "Please Enter User ID").notEmpty(),
];

const sendAttachmentsValidator = () => [
  body("chatId", "Please Enter Chat ID").notEmpty(),
];
const postAttachmentsValidator = () => [
  body("content", "Please Enter content").notEmpty(),
];
const chatIdValidator = () => [param("id", "Please Enter Chat ID").notEmpty()];

const renameValidator = () => [
  param("id", "Please Enter Chat ID").notEmpty(),
  body("name", "Please Enter New Name").notEmpty(),
];

const sendRequestValidator = () => [
  body("userId", "Please Enter User ID").notEmpty(),
];

const acceptRequestValidator = () => [
  body("requestId", "Please Enter Request ID").notEmpty(),
  body("accept")
    .notEmpty()
    .withMessage("Please Add Accept")
    .isBoolean()
    .withMessage("Accept must be a boolean"),
];

const adminLoginValidator = () => [
  body("secretKey", "Please Enter Secret Key").notEmpty(),
];
const eventCreateValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("description", "Please Enter Description").notEmpty(),
  body("date", "Please Enter Date").notEmpty(),
  body("type", "Please Enter Type").notEmpty(),
  body("fee", "Please Enter Fee").notEmpty(),
  body("organizer", "Please Enter Organizer").notEmpty(),
  body("time", "Please Enter Time").notEmpty(),
];
const storyCreateValidator = () => [
  body("description", "Please Enter Description").notEmpty(),
  body("type", "Please Enter Type").notEmpty(),
  body("link", "Please Enter Link").notEmpty(),
];
const courseCreateValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("description", "Please Enter Description").notEmpty(),
  body("startDate", "Please Enter Start Date").notEmpty(),
  body("endDate", "Please Enter End Date").notEmpty(),
  body("type", "Please Enter Type").notEmpty(),
  body("fee", "Please Enter Fee").notEmpty(),
  body("instructor", "Please Enter instructor name").notEmpty(),
];
const accessValidator = () => [
  body("name", "Please Enter Name").notEmpty(),
  body("userid", "Please Enter userid").notEmpty(),
];
const searchValidator = () => [
  body("userid")
    .notEmpty()
    .withMessage("Please provide a user ID")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid user ID"),
];
export {
  acceptRequestValidator,
  addMemberValidator,
  adminLoginValidator,
  chatIdValidator,
  loginValidator,
  newGroupValidator,
  registerValidator,
  removeMemberValidator,
  renameValidator,
  sendAttachmentsValidator,
  sendRequestValidator,
  validateHandler,
  eventCreateValidator,
  courseCreateValidator,
  accessValidator,
  searchValidator,
  postAttachmentsValidator,
  requestValidator,
  storyCreateValidator,
};

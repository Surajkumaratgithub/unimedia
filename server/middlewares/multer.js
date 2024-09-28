import multer from "multer";

const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 10, // Limit file size to 10MB
  },
});
const singleImage = multerUpload.single("img");

// Use .fields() for multiple fields with different names
const singleAvatarAndIdImage = multerUpload.fields([
  { name: "avatar", maxCount: 1 },
  { name: "idImage", maxCount: 1 }
]);
const postImage = multerUpload.fields([
  { name: "attachments", maxCount: 1 },
]);
const singLeimage = multerUpload.fields([
  { name: "imgg", maxCount: 1 },
]);
const storyImage = multerUpload.fields([
  { name: "attach", maxCount: 1 },
]);
// Use .array() for multiple files with the same field name
const attachmentsMulter = multerUpload.array("files", 5);

export { singleAvatarAndIdImage, attachmentsMulter,singleImage,postImage,singLeimage,storyImage };

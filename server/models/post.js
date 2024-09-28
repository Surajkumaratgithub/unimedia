import mongoose, { Schema, model, Types } from "mongoose";
const schema = new Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    ispinned: { type: Boolean, default: false },
    avatar:{type:String},
    attachments: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    creatorid: [
      {
        type: Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Post = mongoose.models.Post || model("Post", schema);

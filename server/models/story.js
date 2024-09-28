import mongoose, { Schema, model } from "mongoose";

const schema = new Schema(
  {
    description: { type: String, required: true },
    link: { type: String },
    type: {
      type: String,
      enum: ["updates", "others", "ad"],
      required: true,
    },
    attachments: 
      {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Story = mongoose.models.Story || model("Story", schema);

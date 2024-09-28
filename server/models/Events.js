import mongoose, { Schema, model } from "mongoose";

const schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    type: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    Image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    onlineDetails: {
      type: String,
    },
    offlineDetails: {
      type: String,
    },
    fee: { type: Number, default: 0 },
    organizer: {
      type: String,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
schema.pre("save", function (next) {
  if (!this.onlineDetails && !this.offlineDetails) {
    const error = new Error(
      "At least one of onlineDetails or offlineDetails must be provided."
    );
    next(error);
  } else {
    next();
  }
});
export const Event = mongoose.models.Event || model("Event", schema);

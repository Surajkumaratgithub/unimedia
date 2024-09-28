import mongoose, { Schema, model,Types} from "mongoose";
const schema = new Schema({
  name: { type: String, required: true ,unique:true},
  type: { type: String, required: true },
  Image: [
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
  ],
  members: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  fee: { type: Number, default: 0 },
  description: { type: String, required: true },
  instructor: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
});
export const Course = mongoose.models.Course || model("Course", schema);

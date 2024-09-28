import mongoose, { Schema, model,Types } from "mongoose";

const schema=new Schema({
    name: {
        type: String,
        required: true,
      },
      userid: [
        {
          type: Types.ObjectId,
          ref: "User",
        },
      ],
});
export const Access = mongoose.models.Access || model("Access", schema);

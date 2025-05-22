import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { url: String, public_id: String },
    category: { type: String },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);
serviceSchema.plugin(mongoosePaginate)

const Service = mongoose.model("Service", serviceSchema);
export default Service
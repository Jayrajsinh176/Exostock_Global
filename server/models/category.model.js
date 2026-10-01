import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      maxlength: 100,
    },
  },
  {
    timestamps: true,
  }
);


categorySchema.index({ company: 1, name: 1 }, { unique: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
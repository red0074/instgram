import mongoose from "mongoose";

const PostSchema = mongoose.Schema({
  username: String,
  imageUrl: String,
  caption: String,
});

export default mongoose.model("posts", PostSchema);

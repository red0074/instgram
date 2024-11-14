import React, { useState } from "react";
import { Button, FilledInput } from "@mui/material";
import axios from "./axios.js";
import "./ImageUpload.css";
function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const data = e.target.files[0];
    if (data) {
      setImage(data);
    }
  };
  const handleUpload = async () => {
    // console.log(username);
    if (username == undefined) {
      alert("please login first");
      return;
    }
    if (!image || !caption) {
      alert("Please add an image and a caption.");
      return;
    }

    const formData = new FormData();
    formData.append("file", image);
    formData.append("caption", caption);
    formData.append("username", username);

    try {
      const response = await axios.post("/addpost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error uploading image and post:", error);
    }
  };
  return (
    <div className="imageupload">
      <input
        type="text"
        placeholder="Enter the Caption"
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type="file" onChange={handleChange} />
      <Button onClick={handleUpload}>upload</Button>
    </div>
  );
}

export default ImageUpload;

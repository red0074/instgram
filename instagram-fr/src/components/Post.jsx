import React from "react";
import "./Post.css";

import { Avatar } from "@mui/material";
function Post({ username, imageUrl, caption }) {
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="userpic"
          // src="https://i.pinimg.com/736x/73/bf/f5/73bff5ec115f325a9bd5b3211716129c.jpg"
          src="https://cdn4.iconfinder.com/data/icons/glyphs/24/icons_user-512.png"
        ></Avatar>
        {/* username */}
        <h3>{username}</h3>
      </div>
      <img className="post__image" src={imageUrl} alt="nothing" />
      <h4 className="post__text">
        <strong>{username}:</strong>
        {caption}
      </h4>
    </div>
  );
}

export default Post;

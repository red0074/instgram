//dependencies
import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import Posts from "./models/Posts.js";
import { createServer } from "http";
import { Server } from "socket.io";
import Users from "./models/Users.js";
import multer from "multer";
import path from "path";
//app config
const app = express();
const port = 5000;
const connection_url = "mongodb://localhost:27017/instagram";
//middleware
app.use(express.json());
app.use(Cors());
app.use("/uploads", express.static("uploads"));
// Create HTTP server and setup Socket.io
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
//dbconfig
mongoose.connect(connection_url);
// Multer configuration for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append the current date and the original file extension
  },
});

const upload = multer({ storage });

//api endpoints
app.get("/", (req, res) => {
  res.status(200).send("this is from backend");
});
app.post("/adduser", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ username });

    if (existingUser) {
      // If user exists, respond with an appropriate message or data
      res.status(200).send("User already exists");
    } else {
      // If user does not exist, create a new user
      const newUser = await Users.create({ username, password });
      res.status(201).send(newUser);
      console.log("New user created:", newUser);
    }
  } catch (err) {
    res.status(500).send("User creation error");
  }
});
app.post("/addpost", upload.single("file"), async (req, res) => {
  try {
    const { caption, username } = req.body;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
      req.file.filename
    }`; // Generate image URL
    const newPost = {
      caption,
      username,
      imageUrl,
    };
    const postdata = await Posts.create(newPost);
    io.emit("newPost", postdata);
    res.status(201).send(postdata);
  } catch (err) {
    res.status(500).send(err);
  }
});
app.get("/getpost", async (req, res) => {
  try {
    const post = await Posts.find();
    console.log(post._id);
    res.status(200).send(post);
  } catch (err) {
    res.send(500).send(err);
  }
});
io.on("connection", (socket) => {
  console.log("a user connected");
});
//listener
server.listen(port, () => {
  console.log(`listening from ${port}`);
});

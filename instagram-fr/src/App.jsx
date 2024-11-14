import { useEffect, useState } from "react";
import Post from "./components/Post";
import axios from "./components/axios.js";
import { io } from "socket.io-client";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import "./App.css";
import ImageUpload from "./components/ImageUpload.jsx";
//server url for socket
const socket = io.connect("http://localhost:5000");
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const [posts, setPosts] = useState([
    // {
    //   username: "smasher",
    //   imageUrl:} />
    //     "https://as1.ftcdn.net/v2/jpg/04/28/02/44/1000_F_428024482_qveKg9LbsPhRzTxDECGndmwHXskBF7Rv.jpg",
    //   caption: "routine stuff",
    // },
  ]);

  useEffect(() => {
    async function fetchData() {
      const req = await axios.get("/getpost");
      setPosts(req.data);
    }
    fetchData();
    // Listen for new posts
    socket.on("newPost", (newPost) => {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("newPost");
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/adduser", { username, password })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          setLoggedIn(true);
          handleClose();
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="app">
      {/*header  */}
      <div className="app__header">
        {/* logo */}
        <img
          className="app__headerImage"
          src="https://cdn4.iconfinder.com/data/icons/social-media-logos-6/512/62-instagram-512.png"
          alt="instagram logo"
          height={50}
        />
        {/* loginbutton */}
        <div className="navbar">
          <div className="login-button">
            {loggedIn ? (
              <div className="app__logout" onClick={handleLogout}>
                <LogoutIcon />
                <span>Logout</span>
              </div>
            ) : (
              <div className="app__login" onClick={handleOpen}>
                <LoginIcon />
                <span>Login</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* posts */}
      <div className="app__posts">
        {posts.map((post) => (
          <Post
            key={post._id}
            username={post.username}
            caption={post.caption}
            imageUrl={post.imageUrl}
          />
        ))}
      </div>
      <ImageUpload username={username} />
      {/* <Post
        username="username"
        imageUrl="https://i.pinimg.com/474x/cc/95/79/cc95791f9db8b42d72ff380900ccc225.jpg"
        caption="caption"
      />
     
      <Post
        username="smasher"
        imageUrl="https://as1.ftcdn.net/v2/jpg/04/28/02/44/1000_F_428024482_qveKg9LbsPhRzTxDECGndmwHXskBF7Rv.jpg"
        caption="routine stuff"
      />
      <Post /> */}
      {/* loginform */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <img
            className="app__headerImage"
            src="https://www.edigitalagency.com.au/wp-content/uploads/Instagram-logo-black-white-horizontal-png.png"
            alt="instagram logo"
            height={50}
          />
          <form className="form">
            <div className="title">
              Welcome,
              <br />
              <span>sign up to continue</span>
            </div>
            <input
              className="input"
              name="username"
              placeholder="Username"
              type="email"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <input
              className="input"
              name="password"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button className="button-confirm" onClick={handleSubmit}>
              Let`s go →
            </button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}

export default App;

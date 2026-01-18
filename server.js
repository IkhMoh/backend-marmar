// https://marmar-f3dy.onrender.com/====
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");

const app = express();
app.use(express.json());

// ===== Cloudinary config =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer + Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "marmer",
    allowed_formats: ["jpg", "png", "jpeg", "gif", "mp4", "mov"],
    resource_type: "auto",
  },
});

const upload = multer({ storage });

// ===== Seed data (in-memory) =====
let users = require(path.join(__dirname, "data", "users.json"));
let posts = require(path.join(__dirname, "data", "posts.json"));
let reels = require(path.join(__dirname, "data", "reels.json"));
let stories = require(path.join(__dirname, "data", "stories.json"));
let suggestions = require(path.join(__dirname, "data", "suggestions.json"));

// ===== USERS =====
app.get("/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id == req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

app.get("/users/:id/posts", (req, res) => {
  const userPosts = posts.filter((p) => p.author.id == req.params.id);
  res.json({ data: userPosts });
});

// ===== POSTS (CRUD) =====
// List all posts
app.get("/posts", (req, res) => {
  res.json({ data: posts });
});

// Show single post
app.get("/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(post);
});

// Create post (media to Cloudinary; tags come from frontend, static conceptually)
app.post("/posts", upload.array("media", 5), (req, res) => {
  const { title, body } = req.body;
  let { tags } = req.body;

  // Ensure tags is an array (tags are still "static" conceptually: frontend decides values)
  if (typeof tags === "string") {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
  }
  if (!Array.isArray(tags)) {
    tags = [];
  }

  const media = (req.files || []).map((file) => ({
    url: file.path,
    type: file.resource_type, // "image" | "video"
  }));
  const newPost = {
    id: posts.length ? posts[posts.length - 1].id + 1 : 1,
    title,
    body,
    media: media,
    tags,
    author: {
      id: 999,
      username: "test_user",
      name: "Test User",
      profile_image: "default.png",
    },
    created_at: new Date().toISOString(),
    comments_count: 0,
    comments: [],
  };

  posts.push(newPost);
  res.status(201).json(newPost);
});

// Delete post
app.delete("/posts/:id", (req, res) => {
  const postId = Number(req.params.id);
  const exists = posts.some((p) => p.id === postId);
  posts = posts.filter((p) => p.id !== postId);
  if (!exists) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json({ success: true });
});

// ===== COMMENTS =====
app.post("/posts/:id/comments", (req, res) => {
  const post = posts.find((p) => p.id == req.params.id);
  if (!post) {
    return res.status(404).json({ error: "Post not found" });
  }

  const { body } = req.body;
  if (!body) {
    return res.status(400).json({ error: "Comment body is required" });
  }

  const newComment = {
    id: post.comments.length
      ? post.comments[post.comments.length - 1].id + 1
      : 1,
    body,
    author: {
      id: 999,
      username: "test_user",
      name: "Test User",
      profile_image: "default.png",
    },
    created_at: new Date().toISOString(),
  };

  post.comments.push(newComment);
  post.comments_count += 1;
  res.status(201).json(newComment);
});

// ===== STORIES =====
app.get("/stories", (req, res) => {
  res.json(stories);
});

app.post("/stories", upload.array("media", 5), (req, res) => {
  const { username } = req.body;
  const mediaUrls = (req.files || []).map((f) => f.path);

  const userStory = {
    id: stories.length ? stories[stories.length - 1].id + 1 : 1,
    username,
    profile_image: "default.png",
    isRead: false,
    stories: mediaUrls.map((m, i) => ({ id: i + 1, image: m })),
  };

  stories.push(userStory);
  res.status(201).json(userStory);
});

// ===== SUGGESTIONS =====
app.get("/suggestions", (req, res) => {
  res.json(suggestions);
});

// Root
app.get("/", (req, res) => {
  res.json({ message: "Marmer API is running" });
});

// for test only
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Marmer API running on http://localhost:${PORT}`);
});

// ===== REELS =====

// Get all reels
app.get("/reels", (req, res) => {
  res.json({ data: reels });
});

// Get single reel
app.get("/reels/:id", (req, res) => {
  const reel = reels.find((r) => r.id == req.params.id);
  if (!reel) {
    return res.status(404).json({ error: "Reel not found" });
  }
  res.json(reel);
});

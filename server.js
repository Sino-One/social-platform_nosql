const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Connecter à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/SocialPlatform", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion :", err));

// Définir les schémas
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  profile: {
    age: Number,
    bio: String,
    interests: [String],
  },
  created_at: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  content: String,
  comments: [
    {
      user_id: mongoose.Schema.Types.ObjectId,
      text: String,
      created_at: { type: Date, default: Date.now },
    },
  ],
  likes: [mongoose.Schema.Types.ObjectId],
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);

const initializeData = async () => {
  const users = await User.find();
  if (users.length === 0) {
    const user1 = new User({
      name: "Alice Dupont",
      email: "alice@example.com",
      profile: {
        age: 25,
        bio: "Traveler",
        interests: ["photography", "hiking"],
      },
    });
    const user2 = new User({
      name: "Jean Martin",
      email: "jean@example.com",
      profile: { age: 30, bio: "Gamer", interests: ["gaming", "streaming"] },
    });
    await user1.save();
    await user2.save();

    const post1 = new Post({
      user_id: user1._id,
      content: "Loving the sunshine today!",
      comments: [{ user_id: user2._id, text: "Me too!" }],
      likes: [user2._id],
    });
    await post1.save();
  }
  console.log("Données initialisées.");
};
initializeData();

// Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.params.userId })
      .populate("comments.user_id", "name")
      .populate("likes", "name");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const post = new Post(req.body);
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/posts/:postId/comments", async (req, res) => {
  const { user_id, text } = req.body;

  if (!user_id || !text) {
    return res.status(400).json({ error: "user_id et text sont requis." });
  }

  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post introuvable." });
    }

    // Ajout du commentaire
    post.comments.push({ user_id, text });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/posts/:userId", async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.params.userId });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Lancer le serveur
app.listen(3001, () => console.log("Serveur lancé sur http://localhost:3001"));

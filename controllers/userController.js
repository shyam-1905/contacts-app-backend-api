const User = require("../models/userModel");
const AsyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//@desc Register a user
//@route GET /api/users/register
//@access Public
const registerUser = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const userAvailable =
    (await User.findOne({ email })) || (await User.findOne({ username }));
  if (userAvailable) {
    res.status(400);
    throw new Error("User already exists");
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log(hashedPassword);
  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("new user created", newUser);
  if (newUser) {
    res.status(201).json({
      _id: newUser.id,
      username: newUser.username,
      email: newUser.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Login a user
//@route GET /api/users/login
//@access Public
const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }
  const user = await User.findOne({ email });
  console.log(user);

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign(
      {
        user: { id: user.id, username: user.username, email: user.email },
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

//@desc Get current user
//@route GET /api/users/current
//@access Private
const currentUser = AsyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };

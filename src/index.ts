import express, { Request, Response } from "express";
import { hash, compare } from "bcryptjs";
import { ContentModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await hash(password, 10);
    await UserModel.create({
      username: username,
      password: hashedPassword,
    });
    res.json({
      message: "User signed up",
    });
  } catch (error) {
    res.status(404).json({
      message: "Input error",
    });
    console.error(error);
  }
});

app.post("/api/v1/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(username);

    const existingUser = await UserModel.findOne({ username });

    if (!existingUser) {
      res.status(401).json({
        message: "User not found",
      });
      return;
    }
    const isPasswordValid = await compare(password, existingUser.password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: "Invalid Credentials",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred during sign-in",
    });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, title, type } = req.body;
  await ContentModel.create({
    link,
    title,
    tags: [],
    type,
    //@ts-ignore
    userId: req.userId,
  });

  res.json({
    message:"Content added"
  })
});
app.delete("/api/v1/content", (req, res) => {});
app.get("/api/v1/content", (req, res) => {});
app.post("/api/v1/brain/share", (req, res) => {});

app.listen(3000, () => {
  console.log("Server running");
});

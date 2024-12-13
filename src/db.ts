import mongoose, { Schema, model } from "mongoose";

mongoose.connect('mongodb://localhost:27017/brainly')
.then(() => console.log("Connected to DB"))
.catch((err) => console.error(err));


const UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true}
})

export const UserModel = model("User", UserSchema);


const contentTypes = ['image', 'video', 'article', 'audio']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

export const ContentModel = model ("Content", contentSchema)
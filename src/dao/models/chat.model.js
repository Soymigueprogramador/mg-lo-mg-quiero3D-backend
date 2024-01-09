import mongoose from "mongoose";

const chatCollection = "chats";

const chatSchema = new mongoose.Schema({
    user: String,
    mensaje: String,
});

export const chatModel = mongoose.model(chatCollection, chatSchema);

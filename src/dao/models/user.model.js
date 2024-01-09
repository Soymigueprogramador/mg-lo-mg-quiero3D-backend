import mongoose from "mongoose";

const usersCollection = "usuarios";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartId: { required: true, type: mongoose.Schema.Types.ObjectId },
    typeofuser: String,
    age: Number,
    last_name: String,
});

export const userModel = mongoose.model(usersCollection, userSchema);

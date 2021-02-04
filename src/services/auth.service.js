import { User } from "../models/user.schema.js";

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  try {
    await User.create(req.body);
    return res.status(201).send({ token: "token" });
  } catch (e) {
    return res.status(500).send({ message: "Email is already used."}).end();
  }
};

export const list = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    return res.status(500).end();
  }
};

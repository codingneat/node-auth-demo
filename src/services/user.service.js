import { User } from "../models/user.schema.js";

export const listUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.send(users);
  } catch (e) {
    return res.status(500).end();
  }
};

export const findOrCreate = async (data) => {
  let user = await User.findOne({ email: data.email });
  if (!user) {
    user = await User.create(data);
  }
  return user;
};


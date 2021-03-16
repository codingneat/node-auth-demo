import { User } from "../models/user.schema.js";

export const signup = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  try {
    await User.create(req.body);
    return res.status(201).send({ token: "token" });
  } catch (e) {
    return res.status(500).send({ message: "Email is already used." }).end();
  }
};

export const signin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send({ message: "need email and password" });
  }

  const invalid = { message: "Invalid email and password combination" };

  try {
    const user = await User.findOne({ email: req.body.email })
      .select("email password")
      .exec();

    if (!user) {
      return res.status(401).send(invalid);
    }

    const match = await user.checkPassword(req.body.password);

    if (!match) {
      return res.status(401).send(invalid);
    }

    const token = "token";
    return res.status(201).send({ token });
  } catch (e) {
    res.status(500).end();
  }
};

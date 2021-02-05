import passport from "passport";
import LocalStrategy from "passport-local";
import { User } from "../models/user.schema.js";
import { newToken } from "../services/auth.service.js";

const localOpts = {
  usernameField: "email",
};

const localStrategy = new LocalStrategy(
  localOpts,
  async (email, password, done) => {
    try {
      const user = await User.findOne({
        email,
      });
      if (!user) {
        return done(null, false);
      } else if (!user.checkPassword(password)) {
        return done(null, false);
      }
      const token = newToken(user);
      return done(null, { ...user.toJSON(), token });
    } catch (e) {
      return done(e, false);
    }
  }
);

passport.use(localStrategy);

export const authLocal = passport.authenticate("local", {
  session: false,
});

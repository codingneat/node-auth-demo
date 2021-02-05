import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { User } from "../models/user.schema.js";
import { newToken } from "../services/auth.service.js";

dotenv.config();

const githubOpts = {
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CLIENT_CALLBACK_URL,
};

const githubStrategy = new GitHubStrategy(
  githubOpts,
  async (accessToken, refreshToken, profile, done) => {
    const data = {
      provider: profile.provider,
      email: profile.emails[0].value,
    };

    if (!data.email) {
      return done(null);
    }

    let user = await User.findOne({ email: data.email });
    if (!user) {
      user = await User.create(data);
    }

    const token = newToken(user);
    return done(null, { ...user.toJSON(), token });
  }
);

passport.use(githubStrategy);

export const authGithub = passport.authenticate("github", {
  scope: ["user:email"],
  session: false,
});
export const authGithubError = passport.authenticate("github", {
  failureRedirect: "/auth",
  session: false,
});

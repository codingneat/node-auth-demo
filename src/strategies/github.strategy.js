import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import { findOrCreate } from "../services/user.service.js";

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

    const user = await findOrCreate(data);

    return done(null, { ...user.toJSON() });
  }
);

passport.use(githubStrategy);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

export const authGithub = passport.authenticate("github", {
  scope: ["user:email"],
  session: true,
});
export const authGithubError = passport.authenticate("github", {
  failureRedirect: "/auth/github",
});

export const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/auth/github');
};

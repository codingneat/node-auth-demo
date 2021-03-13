import { Router } from "express";
import { signin, signup } from "../services/auth.service.js";
import { authLocal } from "../strategies/local.strategy.js";
import { authGithub, authGithubError } from "../strategies/github.strategy.js";

const router = Router();

router.post("/", authLocal, signin);
router.post("/signup", signup);
router.get("/github", authGithub);
router.get("/github/callback", authGithubError, (req, res) => res.redirect('/'));

export default router;

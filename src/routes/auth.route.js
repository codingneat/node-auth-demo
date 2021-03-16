import { Router } from "express";
import { authGithub, authGithubError } from "../strategies/github.strategy.js";

const router = Router();

router.get("/github", authGithub);
router.get("/github/callback", authGithubError, (req, res) => res.redirect('/'));

export default router;

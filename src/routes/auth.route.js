import { Router } from "express";
import { signin, signup } from "../services/auth.service.js";
import { authLocal } from "../strategies/local.strategy.js";

const router = Router();

router.post("/", authLocal, signin);
router.post("/signup", signup);

export default router;

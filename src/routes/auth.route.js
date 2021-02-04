import { Router } from "express";
import { signin, signup } from "../services/auth.service.js";

const router = Router();

router.post("/", signin);
router.post("/signup", signup);

export default router;

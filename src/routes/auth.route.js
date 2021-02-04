import { Router } from "express";
import { signup } from "../services/auth.service.js";

const router = Router();

router.post("/signup", signup);

export default router;

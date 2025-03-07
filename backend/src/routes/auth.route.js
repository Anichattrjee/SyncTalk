import express from "express";
import { signin, signup, signout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/signup",signup);

router.post("/signin",signin);

router.post("/signout",signout);

router.put("/update-profile",protectRoute, updateProfile)

export default router;
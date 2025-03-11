import express from "express";
import { signin, signup, signout, updateProfile, checkAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/signup",signup);

router.post("/signin",signin);

router.post("/signout",signout);
//for updating profile pic after user is signed in
router.put("/update-profile",protectRoute, updateProfile);
//to check if user is authenticated
router.get("/check",protectRoute,checkAuth);

export default router;
import { Router } from "express";
import { login, registerUser } from "./controllers/users-controller.js";
import { authHandler } from "./middlewares/auth.js";
import { getRooms } from "./controllers/rooms-controller.js";

const router = Router();

router.get("/v1/rooms", authHandler, getRooms);
router.post("/v1/login", login);
router.post("/v1/signup", registerUser);

export { router };

import { Router } from "express";
import {
  getUsers,
  login,
  registerUser,
} from "./controllers/users-controller.js";
import { authHandler } from "./middlewares/auth.js";
import { createRoom, getRooms } from "./controllers/rooms-controller.js";

const router = Router();

router.post("/v1/login", login);
router.post("/v1/signup", registerUser);

router.get("/v1/rooms", authHandler, getRooms);
router.post("/v1/rooms", authHandler, createRoom);

router.get("/v1/users", authHandler, getUsers);
router.post("/v1/users");

export { router };

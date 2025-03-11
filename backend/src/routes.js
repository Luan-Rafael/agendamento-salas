import { Router } from "express";
import {
  getUsers,
  login,
  registerUser,
} from "./controllers/users-controller.js";
import { authHandler } from "./middlewares/auth.js";
import {
  createBooking,
  createRoom,
  getBookings,
  getRooms,
} from "./controllers/rooms-controller.js";

const router = Router();

router.post("/v1/login", login);
router.post("/v1/signup", registerUser);

router.get("/v1/rooms", authHandler, getRooms);
router.post("/v1/room", authHandler, createRoom);

router.get("/v1/users", authHandler, getUsers);
router.post("/v1/user");

router.get("/v1/bookings", authHandler, getBookings);
router.post("/v1/booking", authHandler, createBooking);

export { router };

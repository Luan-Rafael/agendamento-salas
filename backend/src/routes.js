import { Router } from "express";
import {
  getUsers,
  login,
  registerUser,
} from "./controllers/users-controller.js";
import { authHandler } from "./middlewares/auth.js";
import {
  createReservation,
  createRoom,
  deleteReservation,
  getReservations,
  getRooms,
  updateReservation,
} from "./controllers/rooms-controller.js";

const router = Router();

router.post("/v1/login", login);
router.post("/v1/signup", registerUser);

router.get("/v1/rooms", authHandler, getRooms);
router.post("/v1/room", authHandler, createRoom);

router.get("/v1/users", authHandler, getUsers);
router.post("/v1/user");

router.get("/v1/reservations", authHandler, getReservations);
router.post("/v1/reservation", authHandler, createReservation);
router.put("/v1/reservation/:id", authHandler, updateReservation);
router.delete("/v1/reservation/:id", authHandler, deleteReservation);


export { router };

import { execute, find, findAll } from "../db/exec.js";
import { ApiError } from "../utils/api-error.js";

export async function getRooms(_, response, next) {
  try {
    const rooms = await findAll(`select * from rooms`);

    response.json({ rooms });
  } catch (error) {
    next(error);
  }
}

export async function createRoom(request, response, next) {
  const { id } = request.user;
  const { name } = request.body;
  try {
    const room = await find(`select * from rooms where name = ?`, [name]);

    if (room) {
      throw new ApiError(`A sala ${name} já foi criada.`, 400);
    }

    await execute(`insert into rooms (name, user_id) values (?, ?);`, [
      name,
      id,
    ]);

    response.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function updateRoom(request, response, next) {
  const { id } = request.params;
  const { name } = request.body;

  try {
    if (!(id && name)) {
      throw new ApiError("Dados ausentes", 400);
    }

    const rooms = await findAll(`update set name = ? from rooms where id = ?`, [
      name,
      id,
    ]);

    response.json({ rooms });
  } catch (error) {
    next(error);
  }
}

export async function getBookings(request, response, next) {
  try {
    const { id } = request.user;
    const bookings = await findAll(`select * from bookings`, [id]);
    response.json({ bookings });
  } catch (error) {
    next(error);
  }
}

export async function createBooking(request, response, next) {
  try {
    const { id } = request.user;
    const bookings = await findAll(`select * from bookings`, [id]);
    response.json({ bookings });
  } catch (error) {
    next(error);
  }
}

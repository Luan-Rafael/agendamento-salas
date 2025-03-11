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

    await execute(`update set name = ?, updated_at = current_timestamp from rooms where id = ?`, [name, id]);

    response.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function getReservations(request, response, next) {
  try {
    const { id: userId } = request.user;

    const user = await find(`select * from users where id = ?`, [userId])

    let where = '';
    const params = []
    if (user.role !== 'admin') {
      where = 'where user_id = ?'
      params.push(userId)
    }

    const reservations = await findAll(`select * from reservations ${where}`, params);

    response.json({ reservations });
  } catch (error) {
    next(error);
  }
}

export async function createReservation(request, response, next) {
  try {
    const { id: userId } = request.user;
    const { description, roomId, startTime, endTime } = request.body


    const { isReservated } = await validateReservation(roomId, new Date(startTime), new Date(endTime))

    if (isReservated) {
      throw ApiError("Sala já está agendada nesse horário!", 400)
    }

    await execute(`insert into reservations (description,user_id,room_id,start_time,end_time) values (?, ?, ?, ?, ?)`, [description, userId, roomId, startTime, endTime])

    response.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function updateReservation(request, response, next) {
  const { id: userId } = request.user
  const { id } = request.params
  try {
    const { description, roomId, startTime, endTime } = request.body;

    const { isReservated } = await validateReservation(roomId, new Date(startTime), new Date(endTime), id)

    if (isReservated) {
      throw ApiError("Sala já está agendada nesse horário!", 400)
    }

    await execute(`update reservations set description = ?,user_id = ?,room_id = ?,start_time = ?,end_time = ? where id = ?`, [description, userId, roomId, startTime, endTime, id])

    response.json();
  } catch (error) {
    next(error);
  }
}


async function validateReservation(roomId, startTime, endTime, id = null) {
  const reservations = await findAll(`select * from reservations where room_id = ? and start_time < ? and end_time > ?`, [roomId, endTime, startTime])

  return {
    isReservated: !!reservations.filter(e => e.id !== id).length,
  }
}
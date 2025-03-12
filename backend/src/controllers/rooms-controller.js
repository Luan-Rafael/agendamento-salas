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

    await execute(
      `update set name = ?, updated_at = current_timestamp from rooms where id = ?`,
      [name, id]
    );

    response.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function getReservations(request, response, next) {
  try {
    const { id: userId } = request.user;

    const user = await find(`select * from users where id = ?`, [userId]);

    const params = [];

    const reservations = await findAll(
      `
      select reservations.id,
             reservations.description,
             reservations.start_time as startTime,
             reservations.end_time as endTime,
             rooms.name as room,
             users.name as user
      from   reservations
              join rooms on rooms.id = reservations.room_id
              join users on users.id = reservations.user_id 
      `,
      params
    ); 

    response.json({
      reservations: reservations.map((reservation) => ({
        ...reservation,
        edit: reservation.userId === user.id,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function createReservation(request, response, next) {
  try {
    const { id: userId } = request.user;
    const { description, date, roomId, startTime, endTime } = request.body;
   
  
    const { isReservated } = await validateReservation({
      roomId,
      date,
      startTime,
      endTime,
    });

    if (isReservated) {
      throw new ApiError("Sala já está agendada nesse horário!", 400);
    }

    await saveReservation({
      userId,
      description,
      roomId,
      date,
      startTime,
      endTime,
    });

    response.status(201).send();
  } catch (error) {
    next(error);
  }
}

export async function updateReservation(request, response, next) {
  const { id: userId } = request.user;
  const { id } = request.params; 
  try {
    const { description, roomId, date, startTime, endTime } = request.body; 

    const reservation = await find(
      `select user_id from reservations where id = ?;`,
      [id]
    ); 
    if (!reservation) {
      throw new ApiError("Reserva não encontrada", 400);
    }

    if (reservation.user_id !== userId) {
      throw new ApiError("Não possui permissão para alterar a reserva", 400);
    } 
    const { isReservated } = await validateReservation({
      roomId,
      date,
      startTime,
      endTime,
      id,
    });

    if (isReservated) {
      throw new ApiError("Sala já está agendada nesse horário!", 400);
    }

    await saveReservation(
      { description, roomId, date, startTime, endTime },
      id
    );

    response.json();
  } catch (error) {
    next(error);
  }
}

export async function deleteReservation(request,response,next) {
  const {id: userId} = request.user
  const {id} = request.params
  try {
    const reservation = await find(
      `select user_id from reservations where id = ?;`,
      [id]
    ); 
    if (!reservation) {
      throw new ApiError("Reserva não encontrada", 400);
    }

    if (reservation.user_id != userId) {
      throw new ApiError("Não possui permissão para alterar a reserva", 400);
    } 
    await execute("delete from reservations where id = ?;", [id])

    response.end();
  } catch (error) {
    next(error)
  }
}


async function validateReservation({
  roomId,
  date,
  startTime,
  endTime,
  id = null,
}) {
  const formattedStartDate =   `${date} ${startTime}:00` 
  const formattedEndDate = `${date} ${endTime}:00`
  
  const reservations = await findAll(
    `select * from reservations where room_id = ? and start_time < ? and end_time > ?;`,
    [roomId, formattedEndDate, formattedStartDate]
  ); 


  return {
    isReservated: reservations.some((e) => e.id != id),
    conflictingReservations: reservations.filter((e) => e.id != id),
  };
}

async function saveReservation(
  { description, userId, roomId, date, startTime, endTime },
  id = null
) {
  const formattedStartDate =   `${date} ${startTime}:00` 
  const formattedEndDate = `${date} ${endTime}:00`
  
  if (id) {
   await execute(
      `update reservations set description = ?,room_id = ?,start_time = ?,end_time = ? where id = ?`,
      [description, roomId, formattedStartDate, formattedEndDate, id]
    );
 
    return;
  }

  await execute(
    `insert into reservations (description,user_id,room_id,start_time,end_time) values (?, ?, ?, ?, ?)`,
    [description, userId, roomId, formattedStartDate, formattedEndDate]
  );
}

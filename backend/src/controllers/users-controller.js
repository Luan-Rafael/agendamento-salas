import { execute, find } from "../db/exec.js";
import { ApiError } from "../utils/api-error.js";
import { hashPassword, validatePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";

export async function login(request, response, next) {
  const { email, password } = request.body;
  try {
    if (!(email && password)) {
      throw new ApiError("Dados ausentes", 400);
    }

    const user = await find(`select * from users where email  = ?`, [email]);

    if (!user) {
      throw new ApiError("Email não encontrado", 400);
    }

    const isValid = await validatePassword(password, user.password);

    if (!isValid) {
      throw new ApiError("Senha inválida", 400);
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });

    response.json({
      token,
      user: {
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function registerUser(request, response, next) {
  const { name, email, password } = request.body; 

  try {
    if (!(name && email && password)) {
      throw new ApiError("Dados incompletos", 401);
    }

    const user = await find(`select * from users where email  = ?;`, [email]);

    if (user) {
      throw new ApiError("Email já cadastrado", 401);
    }

    const hash = await hashPassword(password);

    const { lastID } = await execute(
      `insert into users (name, email, password, role) values(?,?,?, 'user');`,
      [name, email, hash]
    );

    const token = generateToken({
      id: lastID,
      name: name,
      email: email,
    });

    response.status(201).json({
      url: `http://localhost:3001/api/v1/login`,
      token,
    });
  } catch (error) {
    next(error);
  }
}

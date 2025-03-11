import sqlite from "sqlite3";
import { hashPassword } from "../utils/bcrypt.js";
import fs from 'node:fs'

const existDataBase = fs.existsSync('./DATABASE.db')
 
if(!existDataBase) {
  fs.writeFileSync('./DATABASE.db', '')
}

const db = new sqlite.Database("./DATABASE.db", sqlite.OPEN_READWRITE);

const userAdmin = {
  name: 'admin',
  email: 'admin@gmail.com',
  password: () => hashPassword('123456'),
  role: 'admin'
}

const createTables = () => {
  db.serialize(async () => {
    // Tabela de usuários
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NULL
        );       
      `);

    // Tabela de salas
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          user_id INTEGER NOT NULL, 
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NULL,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

    // Tabela de reservas
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          description TEXT NOT NULL,
          user_id INTEGER NOT NULL,
          room_id INTEGER NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        )`);

    const password = await userAdmin.password()

    db.run(`
      -- Verifica se o usuário já existe
      INSERT INTO users (name, email, password, role)
      SELECT ?, ?, ?, ?
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ?);
    `, [userAdmin.name, userAdmin.email, password, userAdmin.role, userAdmin.email]);

    console.log(
      'Tabelas ["users", "rooms", "reservations"] criadas ou já existentem.'
    );
  });
};

// Chama a função para criar as tabelas ao iniciar
createTables();

export { db };

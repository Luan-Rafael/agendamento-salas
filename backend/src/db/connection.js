import sqlite from "sqlite3";

const db = new sqlite.Database("./database.db", sqlite.OPEN_READWRITE);

const createTables = () => {
  db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL
        );       
      `);

    // Tabela de salas
    db.run(`
        CREATE TABLE IF NOT EXISTS rooms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL
        )
      `);

    // Tabela de reservas
    db.run(`
        CREATE TABLE IF NOT EXISTS reservations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          room_id INTEGER NOT NULL,
          start_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
        )`);

    db.run(`
              -- Verifica se o usuário já existe
      INSERT INTO users (name, email, password)
      SELECT 'luan', 'luan.araujo', 'teste'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'luan.araujo');
`);

    console.log(
      'Tabelas ["users", "rooms", "reservations"] criadas ou já existentem.'
    );
  });
};

// Chama a função para criar as tabelas ao iniciar
createTables();

export { db };

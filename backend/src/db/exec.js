import { db } from "./connection.js";

export const execute = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, [...params], function (err) {
      if (err) {
        return reject(err);
      }
      return resolve({
        lastID: this.lastID,
        changes: this.changes,
      });
    });
  });
};

export const find = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, [...params], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

export const findAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, [...params], (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
};

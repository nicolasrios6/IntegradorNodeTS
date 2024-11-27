import mysql from 'mysql2';

  export const cxMysql2 = mysql.createPool({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'Parcial2Labo',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
  });
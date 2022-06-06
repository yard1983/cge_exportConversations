const mysql = require("mysql");
/*
let pool = mysql.createPool({
  multipleStatements: true,
  connectionLimit : 10,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  database: process.env.DATABASE,
  debug : false
});
*/

let pool = mysql.createPool({
  multipleStatements: true,
  connectionLimit : 10,
  host: "mysql-cge.cp6hrw8zpvuu.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "khaa04441nbdjbaUQ5VE",
  port: 3306,
  database: "genesys",
  debug : false
});

const executeQuery = (sql,callback) => {
  return new Promise((resolve, reject) => {
    pool.query(sql , function (error, result) {
        if (error != null) {
            console.log("mysql query error", error);
            return reject(error);
        } else {
            resolve(result);
        }
    })
})
};

const closeConnection = () => {
  pool.end(function (err) {
    // The connection is terminated now
    if (err) {
      console.error("[connection.end]err: " + err);
      connection.destroy();
      return;
    }
    console.log("connection ended");
  });
};


module.exports = {
  closeConnection,
  executeQuery,
};

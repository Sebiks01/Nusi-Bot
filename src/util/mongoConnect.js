const mongoose = require('mongoose');

const msg = require('../config/messages.js');

const mongoConnect = async () => {
  // Creating and returning a new database connection
  console.log(msg.util.db_conn_start);

  return await new Promise((resolve) => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => {
        console.log(msg.util.db_conn_success);
        console.log(
          msg.util.db_conn_id.replace(/{DB_CONN_ID}/g, mongoose.connection.id)
        );

        resolve(mongoose);
      })
      .catch((err) => {
        console.log(msg.util.db_conn_err);
        console.log(err);
      });
  });
};

module.exports = { mongoConnect };

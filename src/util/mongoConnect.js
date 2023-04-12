const mongoose = require('mongoose');
const chalk = require('chalk');

const mongoConnect = async () => {
  // Creating and returning a new database connection
  console.log(chalk.blue('[INFO] Connecting to the database...'));

  return await new Promise((resolve) => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((mongoose) => {
        console.log(
          chalk.green('[INFO] Successfully connected to the database.')
        );
        console.log(
          chalk.blue(`[INFO] Connection ID: ${mongoose.connection.id}`)
        );

        resolve(mongoose);
      })
      .catch((err) => {
        console.log(
          chalk.yellow(
            '[WARN] Invalid mongo uri provided. Aborting connection.'
          )
        );
        console.log(err);
      });
  });
};

module.exports = { mongoConnect };

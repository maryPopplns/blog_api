require('dotenv').config();
const path = require('path');
const mongoose = require('mongoose');
const { logger } = require(path.join(__dirname, '../logger/logger'));

mongoose
  .connect(process.env.LOCAL_CONNECTION, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => logger.info(`DB connection successful 🔓`))
  .catch((error) => logger.error(`${error}`));

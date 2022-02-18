const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('envfile');
const { logger } = require(path.join(__dirname, '/logger/logger'));

fs.readFile('.env', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const parsed = parse(data);
  logger.info(parsed);
});

const fs = require('fs');
const path = require('path');
const { parse, stringify } = require('envfile');
const { logger } = require(path.join(__dirname, '../logger/logger'));

const envFile = '.env';

fs.readFile(envFile, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  // const hour = Math.floor(Date.now() / 1000) + 60 * 60;
  const day = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const parsed = parse(data);
  parsed.EXP = day;
  const final = stringify(parsed);

  fs.writeFile(envFile, final, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    logger.info('expiration updated');
  });
});

// Math.floor(Date.now() / 1000) + 60 * 60

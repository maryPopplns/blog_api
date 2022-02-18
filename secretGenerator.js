const fs = require('fs');
const envfile = require('envfile');

const sourcePath = '.env';
console.log(envfile.parseFileSync(sourcePath));
let parsedFile = envfile.parseFileSync(sourcePath);
parsedFile.NEW_VAR = 'newVariableValue';
fs.writeFileSync('./.env', envfile.stringifySync(parsedFile));
console.log(envfile.stringifySync(parsedFile));

const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/game.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
fs.writeFileSync('temp_script.js', scriptMatch[1]);

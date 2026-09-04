const fs = require('fs');
const html = fs.readFileSync('app/src/main/assets/game.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);

if (scriptMatch) {
  const code = scriptMatch[1];
  try {
    new Function(code);
    console.log("Syntax is VALID!");
  } catch (e) {
    console.error("Syntax Error:", e);
    // Print lines around the error
    const lines = code.split('\n');
    // If error has line number, we could parse it, but let's just dump it
  }
} else {
  console.log("No script tag found?");
}

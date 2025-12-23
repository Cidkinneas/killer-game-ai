const { spawn } = require('child_process');
const port = process.env.PORT || 3000;

const serve = spawn('npx', ['serve', '-s', 'dist', '-l', port.toString()], {
  stdio: 'inherit',
  shell: true
});

serve.on('error', (err) => {
  console.error('Erreur lors du démarrage du serveur:', err);
  process.exit(1);
});

serve.on('exit', (code) => {
  process.exit(code);
});


const { spawn } = require('child_process');
const path = require('path');

// Démarrer le backend
const backend = spawn('node', ['dist/index.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '3001' }
});

// Démarrer le frontend Next.js
const frontend = spawn('npx', ['next', 'start', '-p', '3000'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

backend.on('error', (err) => console.error('Backend error:', err));
frontend.on('error', (err) => console.error('Frontend error:', err));

process.on('SIGTERM', () => {
  backend.kill();
  frontend.kill();
  process.exit(0);
});

console.log('🚀 Sagesse d\'Afrique started!');
console.log('   Frontend: http://localhost:3000');
console.log('   Backend API: http://localhost:3001');


// Configuration PM2 pour le frontend Next.js (mode standalone)
module.exports = {
  apps: [
    {
      name: 'sagesse-frontend',
      script: '.next/standalone/frontend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0',
      },
    },
  ],
};


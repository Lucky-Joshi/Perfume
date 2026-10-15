import 'dotenv/config';
import app from './app.js';
import pkg from '../package.json' with { type: 'json' };

const PORT = Number(process.env.PORT || 5000);

const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`  ${pkg.name} v${pkg.version}`);
  console.log(`  API ready on http://localhost:${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('========================================\n');
});

// Graceful shutdown
const shutdown = (signal) => {
  console.log(`\n[server] ${signal} received. Closing server...`);
  server.close(() => {
    console.log('[server] Closed. Goodbye.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
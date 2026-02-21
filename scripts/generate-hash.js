const crypto = require('crypto');

const password = process.argv[2];

if (!password) {
  console.log('Uso: node generate-hash.js "tu-contraseña"');
  process.exit(1);
}

const secret = process.env.SESSION_SECRET || 'default_secret_change_this_in_production_32chars!';
const salt = crypto.randomBytes(32).toString('hex');
const hash = crypto.createHash('sha256')
  .update(password + salt + secret)
  .digest('hex');

console.log('\n═══════════════════════════════════════════════════');
console.log('  HASH GENERADO');
console.log('═══════════════════════════════════════════════════\n');
console.log('Pega esto en tu .env.local:\n');
console.log(`ADMIN_PASSWORD_HASH=${salt}:${hash}\n`);
console.log('═══════════════════════════════════════════════════\n');

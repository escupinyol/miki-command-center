const crypto = require('crypto');

// Generar hash seguro de contraseña
function hashPassword(password, secret) {
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.createHash('sha256')
    .update(password + salt + secret)
    .digest('hex');
  return `${salt}:${hash}`;
}

// Generar secret de sesión
function generateSessionSecret() {
  return crypto.randomBytes(64).toString('hex');
}

const password = process.argv[2] || 'cambia-esta-contraseña';
const sessionSecret = generateSessionSecret();
const passwordHash = hashPassword(password, sessionSecret);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  🔐 Configuración de Seguridad - Miki Command Center');
console.log('═══════════════════════════════════════════════════════════\n');

console.log('Añade estas variables a tu archivo .env.local:\n');
console.log('SESSION_SECRET=' + sessionSecret);
console.log('ADMIN_PASSWORD_HASH=' + passwordHash);
console.log('\n⚠️  IMPORTANTE:');
console.log('   - Guarda la contraseña original en un lugar seguro');
console.log('   - No compartas el SESSION_SECRET');
console.log('   - En producción, usa variables de entorno de Vercel');
console.log('\n═══════════════════════════════════════════════════════════\n');

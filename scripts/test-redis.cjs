const dotenv = require('dotenv');
dotenv.config();
const Redis = require('ioredis');
const { URL } = require('url');

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function testWithUrl(url, opts, label) {
  console.log(`\n--- Test: ${label} ---`);
  let client;
  try {
    console.log('Opciones usadas:', Object.keys(opts || {}).length ? JSON.stringify(opts).slice(0,200) : 'ninguna');
    client = url ? new Redis(url, opts) : new Redis(opts);

    client.on('connect', () => console.log('[event] connect'));
    client.on('ready', () => console.log('[event] ready'));
    client.on('close', () => console.log('[event] close'));
    client.on('reconnecting', () => console.log('[event] reconnecting'));
    client.on('end', () => console.log('[event] end'));
    client.on('error', (e) => console.error('[event] error', e && e.code ? e.code : (e && e.message) ? e.message : e));

    await new Promise((resolve) => {
      let done = false;
      const timeout = setTimeout(() => {
        if (done) return;
        done = true;
        console.log('Timeout: no respondió en 10s');
        resolve();
      }, 10000);

      client.ping()
        .then((r) => {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          console.log('PING result:', r);
          resolve();
        })
        .catch((err) => {
          if (done) return;
          done = true;
          clearTimeout(timeout);
          console.error('PING error:', err && err.code ? err.code : (err && err.message) ? err.message : err);
          resolve();
        });
    });
  } catch (err) {
    console.error('Test exception:', err && err.code ? err.code : (err && err.message) ? err.message : err);
  } finally {
    if (client) {
      try { await client.quit(); } catch(e){ try{ client.disconnect(); }catch(_){} }
    }
    await wait(200);
  }
}

(async () => {
  const url = process.env.REDIS_URL;
  if (!url) {
    console.error('No REDIS_URL en .env');
    process.exit(1);
  }

  const sanitized = url.replace(/:(.+)@/, '://*****@');
  console.log('REDIS_URL (sanitizado):', sanitized);

  // Test 1: usar la URL tal cual (sin opciones TLS explícitas)
  await testWithUrl(url, {}, 'No TLS (URL)');

  // Test 2: pasar opciones TLS vacías (forzar TLS)
  try {
    const parsed = new URL(url);
    const tlsOpts = { tls: { servername: parsed.hostname } };
    await testWithUrl(url, tlsOpts, 'Forzar TLS (URL + tls: {servername})');

    // Test 3: construir conexión por host/port + TLS (incluyendo username)
    const conn = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port) : undefined,
      username: parsed.username || undefined,
      password: parsed.password || undefined,
      tls: { servername: parsed.hostname },
    };
    await testWithUrl(null, conn, 'Host/Port + TLS (con username)');

    // Test 4: host/port sin username (password sólo) - sin TLS
    const connPwdOnly = {
      host: parsed.hostname,
      port: parsed.port ? parseInt(parsed.port) : undefined,
      password: parsed.password || undefined,
    };
    await testWithUrl(null, connPwdOnly, 'Host/Port (password sólo) - sin TLS');

    // Test 5: host/port sin username (password sólo) - con TLS
    const connPwdOnlyTls = Object.assign({}, connPwdOnly, { tls: { servername: parsed.hostname } });
    await testWithUrl(null, connPwdOnlyTls, 'Host/Port (password sólo) + TLS');
  } catch (err) {
    console.error('No se pudo parsear REDIS_URL para pruebas TLS:', err.message);
  }

  console.log('\n--- Tests terminados ---');
  process.exit(0);
})();

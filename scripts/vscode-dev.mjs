// Used only by VS Code. No npm shell or PowerShell execution policy involved.
import net from 'node:net';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const project = new URL('../', import.meta.url);
const root = fileURLToPath(project);
const port = Number(process.env.ASTRO_VSCODE_PORT || 4321);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port de développement invalide.');
const origins = [`http://127.0.0.1:${port}`, `http://localhost:${port}`];
const packagePath = fileURLToPath(new URL('package.json', project)).replaceAll('\\', '/');
const packageContents = await readFile(new URL('package.json', project), 'utf8');

async function isProjectDevServer(origin) {
  try {
    // A production preview cannot serve Vite's HMR client. The absolute file
    // request also distinguishes this checkout from a different Vite project.
    const [client, source] = await Promise.all([
      fetch(`${origin}/@vite/client`, {signal:AbortSignal.timeout(2500)}),
      fetch(`${origin}/@fs/${encodeURI(packagePath)}?raw`, {signal:AbortSignal.timeout(2500)}),
    ]);
    if (!client.ok || !source.ok) return false;
    const [clientText, sourceText] = await Promise.all([client.text(), source.text()]);
    const exported = sourceText.match(/export default ("(?:[^"\\]|\\.)*")/);
    const servedContents = exported ? JSON.parse(exported[1]) : sourceText;
    return clientText.includes('createHotContext') && servedContents.trim() === packageContents.trim();
  } catch { return false; }
}

function portInUse(host) {
  return new Promise(resolve => {
    const socket = net.createConnection({host,port});
    const finish = used => {socket.destroy();resolve(used);};
    socket.once('connect', () => finish(true));
    socket.once('error', () => finish(false));
    socket.setTimeout(1500, () => finish(true));
  });
}

async function main() {
  console.log('ASTRO_VSCODE_STARTING');
  for (const origin of origins) {
    if (await isProjectDevServer(origin)) {
      console.log(`Serveur Astro existant réutilisé : ${origin}/fr/`);
      console.log('ASTRO_VSCODE_READY');
      return;
    }
  }
  if ((await Promise.all(['127.0.0.1','::1'].map(portInUse))).some(Boolean)) {
    throw new Error(`Le port ${port} est occupé par un autre serveur ou un aperçu de production. Arrêtez ce service puis relancez F5. Aucun processus n’a été arrêté.`);
  }

  const { dev } = await import('astro');
  const server = await dev({
    root,
    server:{host:'127.0.0.1',port,open:false},
    vite:{server:{strictPort:true}},
  });
  // Wait for an actual development HTTP response, not just a listening socket.
  if (!(await isProjectDevServer(origins[0]))) {
    await server.stop();
    throw new Error('Astro a démarré, mais la vérification du serveur de développement a échoué.');
  }
  console.log(`Astro prêt : ${origins[0]}/fr/ — rechargement à chaud actif.`);
  console.log('ASTRO_VSCODE_READY');
  let stopping = false;
  const stop = async () => {
    if (stopping) return;
    stopping = true;
    await server.stop();
    process.exit(0);
  };
  process.once('SIGINT', stop);
  process.once('SIGTERM', stop);
}

main().catch(error => {
  console.error(`${fileURLToPath(import.meta.url)}:1:1: error: ${error.message}`);
  process.exitCode = 1;
});

import { spawn } from 'node:child_process';
const services = { gotcha: [3001, 'games/gotcha-rush/server/index.js'], typedash: [4001, 'games/typedash/server/index.js'], pickparty: [5001, 'games/pickparty/server/index.js'], sketch: [7001, 'games/sketch-and-guess/server/index.js'], admin: [6001, 'admin/server.js'] };
const service = services[process.argv[2]];
if (!service) throw new Error('Unknown service');
const child = spawn(process.execPath, ['--env-file-if-exists=server/.env', service[1]], { stdio: 'inherit', env: { ...process.env, PORT: String(service[0]) } });
child.on('exit', code => { process.exitCode = code || 0; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));

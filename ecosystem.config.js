// PM2 process definition for the Hostinger VPS.
//
// Started once with `pm2 start ecosystem.config.js`; afterwards scripts/deploy.sh
// calls `pm2 reload` on every deploy.
//
// `next start` is invoked through its bin directly rather than through `npm start`
// so PM2 signals reach the Node process itself — an `npm` wrapper in between
// swallows SIGINT/SIGTERM and turns graceful reloads into hard kills.

module.exports = {
  apps: [
    {
      name: "eliteproinfra",
      cwd: __dirname,
      script: "./node_modules/next/dist/bin/next",
      args: "start --port 3000",
      // Fork mode, single instance. The site is fully static/SSG plus two mail
      // API routes, so there is nothing to gain from clustering yet. To scale
      // later: set instances to a number and exec_mode to "cluster".
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_restarts: 10,
      // A Next.js server that grows past this is leaking; restart rather than
      // let the VPS start swapping.
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // SMTP_* credentials are NOT listed here — they live in .env.local on the
        // server (gitignored), which Next.js loads automatically at startup.
      },
      // PM2 writes both streams under ~/.pm2/logs by default; keep timestamps so
      // `pm2 logs eliteproinfra` is readable when debugging a failed form submit.
      time: true,
    },
  ],
};

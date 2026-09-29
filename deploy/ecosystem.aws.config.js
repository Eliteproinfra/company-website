// PM2 process definition for the AWS EC2 deployment.
//
// SEPARATE FROM ../ecosystem.config.js ON PURPOSE. That file is the Hostinger
// VPS definition and uses `cwd: __dirname`, which resolves to whatever
// directory the file physically sits in. Under the atomic-release layout used
// here that would pin PM2 to one specific release forever: after `current` is
// repointed, PM2 would keep respawning out of the old release directory and the
// deploy would silently have no effect.
//
// So every path below is absolute and goes through the `current` symlink. PM2
// stores the cwd string verbatim and chdir()s to it on each respawn, so the
// symlink is resolved fresh at spawn time -- which is exactly what makes
// `pm2 reload` pick up a new release.
//
// Started once with:
//   pm2 start /var/www/eliteproinfra/shared/ecosystem.aws.config.js
// and reloaded by scripts/aws-deploy.sh on every deploy afterwards.

const APP_ROOT = "/var/www/eliteproinfra";

module.exports = {
  apps: [
    {
      name: "eliteproinfra",
      cwd: `${APP_ROOT}/current`,

      // Invoke the Next binary directly rather than through `npm start`: an npm
      // wrapper in between swallows SIGINT/SIGTERM, which turns a graceful
      // reload into a hard kill and drops in-flight requests.
      script: `${APP_ROOT}/current/node_modules/next/dist/bin/next`,
      args: "start --port 3000",

      // Fork mode, single instance. The site is ~130 prerendered pages plus a
      // handful of dynamic admin routes, so there is nothing to gain from
      // clustering. To scale later: raise `instances` and set exec_mode
      // to "cluster".
      instances: 1,
      exec_mode: "fork",

      autorestart: true,
      max_restarts: 10,
      // A Next.js server that grows past this is leaking. Restart it rather
      // than let a 3.7G box start swapping.
      max_memory_restart: "768M",

      // Give in-flight requests and any after() callbacks time to finish on
      // SIGTERM before PM2 escalates to SIGKILL. The Next.js self-hosting guide
      // recommends a 10-30s drain window.
      kill_timeout: 15000,
      // Only count the process as online once it has stayed up this long,
      // so a boot-crash loop is reported as a failed reload instead of
      // "online".
      min_uptime: 10000,
      listen_timeout: 20000,

      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Application secrets are NOT here. They live in
        // /var/www/eliteproinfra/shared/.env.local (chmod 600, symlinked into
        // each release), which Next.js loads automatically at startup.
      },

      // Logs go to a predictable location rather than ~/.pm2/logs so the
      // CloudWatch agent config and the nginx logs sit side by side.
      output: "/var/log/eliteproinfra/app-out.log",
      error: "/var/log/eliteproinfra/app-error.log",
      time: true,
    },
  ],
};

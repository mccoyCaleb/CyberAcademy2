# CyberAcademy2

## Run the full LMS

The database-backed LMS still runs locally with Node.js:

```sh
npm install
npm start
```

Open the localhost URL printed by the server. The login page, role-based dashboards, classes, assignments, curriculum tools, and progress tracking are served by this app.

## Hosting

GitHub Pages only serves static files. It cannot run this app's Express server, SQLite database, login sessions, or form handlers, so publishing this repository with Pages will not provide the original LMS behavior. To keep login and the dashboard features working online, deploy this Node.js app to a host that runs `npm start` and supports persistent storage for `data/learning.db`. The app's entry page links directly to the server's `/login` route.

Do not use the browser-only prototype in `script.js` for real accounts: its local-storage data is not secure and is not shared across users or devices.

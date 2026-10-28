# CyberAcademy2

## Publish with GitHub Pages

This project can be published as a static course site. In the repository's GitHub settings, open **Pages**, select **Deploy from a branch**, choose the branch containing the site, and select the repository root (`/`). The homepage is `index.html`; lesson pages and assets use relative paths so they also work when the repository is published under a project URL.

The Pages version provides course browsing without a login. GitHub Pages does not run Express, SQLite, server-side sessions, or form handlers, so account authentication, shared class management, assignments, and progress tracking from `server.js` are not available in that deployment. Do not put real passwords, student records, or private course data in browser-side code or `localStorage`.

## Run the full local LMS

The database-backed LMS still runs locally with Node.js:

```sh
npm install
npm start
```

Open the localhost URL printed by the server. This mode is separate from the GitHub Pages site and is not required to publish or browse the static lessons.

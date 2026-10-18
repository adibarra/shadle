<h1 align="center">
  <a href="https://github.com/adibarra/shadle">
    <img src="./packages/client/public/favicon.svg" alt="Logo" height="128">
  </a>
  <br>
  Shadle
</h1>

<h3 align="center">
  A Vue-based Wordle-style game for colors with PWA and notifications
</h3>

<p align="center">
  <a href="https://github.com/adibarra/shadle/issues">
    <img src="https://img.shields.io/github/issues/adibarra/shadle" alt="issues">
  </a>
  <a href="#">
    <img src="https://img.shields.io/github/last-commit/adibarra/shadle" alt="last commit">
  </a>
  <br />
  <a href="#overview">Overview</a> •
  <a href="#environment-setup">Environment Setup</a> •
  <a href="#project-scripts">Scripts</a> •
  <a href="#license">License</a>
</p>

<!-- ![screenshot](./.github/screenshot.png) -->

## Overview

Shadle is a web app that implements a Wordle-style game for guessing colors. Built with modern web technologies, it features a progressive web app (PWA) with notifications, allowing users to play and track their progress.

The project is a Bun workspace monorepo with a Vue frontend, a Bun backend, and a PostgreSQL database.

## Environment Setup

This is a one-time setup. If you have already done this, you can skip to the next section.

1. Install [Bun](https://bun.sh) v1.4 or newer.

2. Clone the repository and navigate into the project directory:

   ```bash
   # Clone the Shadle repository from GitHub
   $ git clone https://github.com/adibarra/shadle.git
   # Change into the project directory
   $ cd shadle
   ```

3. Install dependencies and create your local environment file:

   ```bash
   # Install dependencies
   $ bun install
   # Copy the example environment file to create a local .env file
   $ cp --no-clobber .env.example .env
   ```

4. Make sure to fill out the `.env` file with the appropriate values.
5. **Set up PostgreSQL database** (for dev/testing)

   ```bash
   # Create database container for both development and testing
   sudo docker run -d --name shadle-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=postgres \
     -p 5432:5432 \
     postgres:18-alpine

   # Create database
   sudo docker exec shadle-db \
     psql -U postgres -c "CREATE DATABASE shadle;"

   # Create dev database
   sudo docker exec shadle-db \
     psql -U postgres -c "CREATE DATABASE shadle_dev;"
   ```

## Project Scripts

Make sure you are in the repo's root directory before running these commands.

| Scripts           | Description                                        |
| ----------------- | -------------------------------------------------- |
| bun run build     | builds the app for production (use before preview) |
| bun run check     | runs type checks                                   |
| bun run clean     | removes build artifacts                            |
| bun run clean:all | removes build artifacts and dependencies           |
| bun run dev       | runs development environment                       |
| bun run fmt       | checks formatting (oxfmt)                          |
| bun run fmt:fix   | formats the code (oxfmt)                           |
| bun run lint      | lints the code (oxlint)                            |
| bun run lint:fix  | auto-fixes lint issues (oxlint)                    |
| bun run preview   | runs the full built app in production preview mode |
| bun run start     | starts the server                                  |
| bun run taze      | updates dependencies                               |
| bun run test      | runs tests                                         |

## License

MIT License

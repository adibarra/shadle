<h1 align="center">
  <a href="https://github.com/adibarra/shadle">
    <img src="./packages/client/public/favicon.svg" alt="Logo" height="128">
  </a>
  <br>
  Shadle
</h1>

<h3 align="center">
  A React-based Wordle-style game for colors with PWA and notifications
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

The project is built using a monorepo structure with pnpm, featuring a React frontend, Node.js backend, and PostgreSQL database.

## Environment Setup

This is a one-time setup. If you have already done this, you can skip to the next section.

1. Install [nvm](https://github.com/nvm-sh/nvm) for your platform, then install and use Node.js v24:

   ```bash
   # Install Node.js version 24 using nvm
   $ nvm install 24
   # Switch to use Node.js version 24
   $ nvm use 24
   ```

   Alternatively, install Node.js v24 directly. Other versions may work but are not tested.

2. Clone the repository and navigate into the project directory:

   ```bash
   # Clone the Shadle repository from GitHub
   $ git clone https://github.com/adibarra/shadle.git
   # Change into the project directory
   $ cd shadle
   ```

3. Run the following commands:

   ```bash
    # Enable corepack to manage package managers
    $ corepack enable
    # Install the required package manager (pnpm) via corepack
    $ corepack install
    # Copy the example environment file to create a local .env file
    $ cp --no-clobber .env.example .env
   ```

   Alternatively, if you prefer not to use corepack, install pnpm by following these instructions: [https://pnpm.io/installation](https://pnpm.io/installation).

4. Make sure to fill out the `.env` file with the appropriate values.
5. **Set up PostgreSQL database** (for dev/testing only; production uses docker compose)

   ```bash
   # Create database container for both development and testing
   sudo docker run -d --name shadle-db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -e POSTGRES_DB=shadle \
     -p 5432:5432 \
     postgres:alpine

   # Create test database
   sudo docker exec shadle-db \
     psql -U postgres -c "CREATE DATABASE shadle_dev;"
   ```

## Project Scripts

Make sure you are in the repo's root directory before running these commands.

| Scripts         | Description                                        |
| --------------- | -------------------------------------------------- |
| pnpm build      | builds the app for production (use before preview) |
| pnpm check      | runs type checks                                   |
| pnpm clean      | removes build artifacts                            |
| pnpm clean:all  | removes build artifacts and dependencies           |
| pnpm dev        | runs development environment                       |
| pnpm dev:client | runs development environment for client only       |
| pnpm dev:core   | runs development environment without tasks         |
| pnpm dev:server | runs development environment for server only       |
| pnpm lint       | prints warnings about code formatting              |
| pnpm lint:fix   | auto-fixes the code formatting                     |
| pnpm preview    | runs the full built app in production preview mode |
| pnpm start      | starts the server                                  |
| pnpm taze       | updates dependencies                               |
| pnpm test       | runs tests                                         |

## License

MIT License

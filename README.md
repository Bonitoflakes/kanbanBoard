# Kanban Board

A basic kanban board inspired by notion + trello.

## Features

- Light/dark mode toggle
- Custom theme without runtime performance hit.
- Mobile Friendly.

## Run backend

Clone the [project](https://github.com/Bonitoflakes/kanban-backend)

```bash
  git clone https://github.com/Bonitoflakes/kanban-backend.git
```

Go to the project directory

```bash
  cd kanban-backend
```

Install dependencies

```bash
  bun install
```

Start the server

```bash
  bun dev
```

Note: The backend is very fragile, if it crashes when encountering any edge case, please restart the server manually.

## Run frontend

Clone the [project](https://github.com/Bonitoflakes/kanbanBoard)

```bash
  git clone https://github.com/Bonitoflakes/kanbanBoard.git
```

Go to the project directory

```bash
  cd kanbanBoard
```

Install dependencies

```bash
  bun install
```

Start the server

```bash
  bun dev
```

## Tech Stack

**Client:** React, Redux, TailwindCSS

**Server:** Node, Express

Future Reference:
Check data-theme strategy for column colors.

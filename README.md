# COMP2406 Movie DB Project

## Project Structure
You can start, install and do other housekeeping stuff from top-level since the `package.json` has all that. But if you are developing please `cd frontend` or `cd backend` into whatever project you are working on. Install projects related deps in those folders.
```
.
├── README.md
├── .vscode
├── backend    <-- API
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── tsconfig.json
├── frontend    <-- React App
│   ├── README.md
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public
│   ├── src
│   ├── tailwind.config.js
│   └── tsconfig.json
├── package-lock.json
└── package.json
```

## Available Scripts
`npm run [command]`
Available Commands
```
dev         Run dev server that will restart automatically 
build       Create a production builds
clean       Run clean commands (where applicable)
start       Run production version of backend and dev for frontend
lint        Run eslint frontend + backend
```

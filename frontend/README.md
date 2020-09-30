# Frontend

## Important
When in development mode (i.e, using `npm start`) there will be a blank screen on first load. You have to reload the page. That issue is related to issue in create-react-app https://github.com/facebook/create-react-app/issues/5809. A dumb workaround as mentioned in that issue is to add a delay to start script. I have tested this on a Mac and don't know how this works on windows, **If you are using windows and `start` doesn't work** you can update this script in `package.json`
`"dev:react": "sleep 3 && react-scripts start",` to `"dev:react":react-scripts start",`

## Available Scripts
`npm run [command]`
Available Commands
```
lint        Run eslint
dev         Run Tailwind Compiler in watcher mode and start react script
start       Run dev
build       Create a production build
```

# Backend

## Available Scripts
`npm run [command]`
Available Commands
```
lint        Run eslint
dev         Run TypeScript watcher and nodemon parallel 
build       Create a production build
clean       Using rimraf remove old build
start       Run clean, build and then start the server
```

## Endpoints

NOTE: Currently we are just using the [`movie-data-short.json`](../dataset/movie-data-short.json) for data.

### GET
- `users`
  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
    - `id`
    - `name`
    - `role`
  - `/`
    - Returns an array all users
  - `/:user`
    - Returns a user

- `movies`
  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
    - `id`
    - `title`
    - `genre`
    - `actors`
    - `writer`
    - `director`
    - `year`
    - `poster`
    - `rated`
    - `released`
  - `/`
    - Returns an array of all movies
  - `/:movie`
    - Returns a movie

### POST
- `movies`
  - `/`
    - Returns a success message. You must specify the following fields.
      - `title`
      - `genre`
      - `actors`
      - `writer`
      - `director`
      - `year`
      - `poster`
      - `rated`
      - `released`

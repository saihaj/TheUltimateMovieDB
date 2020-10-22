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

### GET
- `users`
  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
    - `_id`
    - `name`
    - `role`
  - `/`
    - Returns an array all users
  - `/:user`
    - Returns a user

- `movies`
  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
    - `title`
    - `genre`
    - `actors`
    - `writer`
    - `director`
    - `ratings`
    - `reviews`
  - `/`
    - Returns an array of all movies
  - `/:movie`
    - Returns a movie

### POST
- `movies`
  - `/`
    - Returns a boolean value. You must specify the following fields.
      - `title`
      - `genre`
      - `actors`
      - `writer`
      - `director`
      - `ratings`
      - `reviews`

### UPDATE
- `users`
  - `/:user/role`
    - Switches the role of user and returns `user` object.

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

NOTE: Users and People route use mongo db to store everything. Movies route are not yet moved to use DB it still uses [`movie-data-short.json`](../dataset/movie-data-short.json) for data and the data is stored in RAM for this route only.

I did setup mongo schema for all the routes see [`models`](./src/models/index.ts)

### GET

- `users`

  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route. Most accurate object return type in [users model](./src/models/user.ts)
    - `_id`
    - `name`
    - `role`
    - `email`
    - `password`
    - `moviesLoved : [{count, movies: MovieObjectId}]`
    - `moviesHates : [{count, movies: MovieObjectId}]`
  - `/`
    - Returns an array all users
  - `/:userId`
    - Returns a user given an ID

- `people`

  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
  - Most accurate object return type in [people model](./src/models/people.ts)
  - `/`:
    - Returns and array of people objects
    - `/:personId`
      - Query params accepted
        - name
        - limit
          - default: 10
          - max: 50
        - offset
          - default: 0
      - Returns a people object

- `movies`
  - Following fields should be returned by all endpoints in this route. Check for exceptions or additional fields for that route.
  - Most accurate object return type in [movie model](./src/models/movie.ts)
  - `/`
    - Query params accepted
      - title
      - genre
      - year
      - minrating
      - limit
        - default: 10
        - max: 50
      - offset
        - default: 0
    - Returns
      - ```json
        {
          "info": {
            limit,
            "nextOffset": offset + limit
          },
          "results": [movie]
        }
        ```
    - Movies are returned in ascending order as in DB
  - `/:movie`
    - Returns a movie
  - `/reviews/:movie`
    - Returns array of reviews. See [movie review schema](./src/models/movie.ts).
  - `/rating/:movie`
    - Returns array of reviews. See [movie rating schema](./src/models/movie.ts).
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
  - `/review/:movie`
    - Specify the following fields
      - `user`: ObjectID
      - `comment`: String
    - Returns the review added
- `people`
  - `/`
    - Returns the object created (see GET request for return or [people model](./src/models/people.ts)). You must specify the following fields.
      - `name`
        - Optional Fields
          - `director: [MovieObjectId]`
          - `actor: [MovieObjectId]`
          - `writer: [MovieObjectId]`
- `users`
  - `/`
    - You must specify the following fields. Returns the object create. Most accurate object return type in [users model](./src/models/user.ts)
      - `name`
      - `email`
      - `password`
        - Optional fields (for now)
          - `role?: ['regular','contributing']`
          - `moviesHated?: [{ count?: number, movies?: Movie ObjectId }]`
          - `moviesLoved?: [{ count?: number, movies?: Movie ObjectId }]`
  - `/login`
    - You must specify the following fields
      - `email`
      - `password`
    - Returns the a user object and also gives back the `refresh` and `access` tokens. This will also set the cookies for tokens and user role
  - `/token`
    - You must given in a refresh token
      - `token`
    - It will generate a new access token
  - `/token/update`
    - You must give an object
      - `{tokens: {refresh, access}}`
    - Returns a user object with new tokens. Also sets them in cookies (similar to `login`)
  - `/token/decode`
    - You must give a JWT
      - `token`
    - This will decode the JWT token

### PATCH

- `users`
  - `/:userId/role`
    - Updates the role of user
    - Returns success message from mongo and new role that is updated
- `movies`
  - `/rating`
    - `/upvote/:movie`
      - Upvote a movie
      - Returns [movie rating schema](./src/models/movie.ts) or message if already voted
    - `/downvote/:movie`
      - Downvote a movie
      - Returns [movie rating schema](./src/models/movie.ts) or message if already voted
  - `/score/:movie`
    - Send the new score in payload
    - Returns the new average score

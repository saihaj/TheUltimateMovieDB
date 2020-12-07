# COMP2406 Final Report

**Saihajpreet Singh** (101150058)

## Table of Contents

- [COMP2406 Final Report](#comp2406-final-report)
  - [Table of Contents](#table-of-contents)
  - [Project Instructions](#project-instructions)
  - [Functionality](#functionality)
    - [Search](#search)
    - [User Accounts](#user-accounts)
    - [Movies](#movies)
    - [People](#people)
    - [Notifications](#notifications)
    - [API Documentation](#api-documentation)
    - [DB Initialization Scripts](#db-initialization-scripts)
  - [Extensions](#extensions)
  - [Design Decisions](#design-decisions)
  - [Improvements](#improvements)
    - [Caching](#caching)
    - [Authentication](#authentication)
    - [Notifications](#notifications-1)
    - [Over-fetching/Under-fetching](#over-fetchingunder-fetching)
  - [Modules](#modules)
  - [Final Thoughts](#final-thoughts)

## Project Instructions

Project is deployed on [OpenStack](https://carleton.ca/scs/tech-support/scs-open-stack/). The public IP address for my instance is `134.117.128.78`

- `ssh student@134.117.128.78`
  - password: `student`
- Once you are logged in then `cd TheUltimateMovieDB`
  - I have installed all the dependencies but if something seems to fail please run `npm install`
  - Database should also be running but if it is not please run `cd backend && sudo npm run start:mongo && cd ..`
- Now do `npm start` and this should clean build the backend (`http://localhost:4000`) and frontend (`http://localhost:3000`). It is important the the DB is running otherwise backend will crash if it fails to connect to DB.
- Once you see "[start:frontend] Compiled successfully!" you should be able to tunnel and check the site.
- When I tested I just needed to tunnel my frontend and it was working fine. To run site on your machine at `https://localhost:9999` run this `ssh -L 9999:localhost:3000 student@134.117.128.78` and it should work!
- Test User credentials
  - email: test@test.com
  - password: testtesttest

## Functionality

Note: Unless specified backend all routes mentioned in this section correspond to frontend.

### Search

- Homepage has a search bar that gets results as you type
- By polling the API as you type allows to make a good UX
- On backend it does a [$regex](https://docs.mongodb.com/manual/reference/operator/query/regex/) on `title` field in Movies collection to fetch different results

### User Accounts

- Create new user account
  - Name
  - Email
  - Password
  - Regular user by default
- Login using email/password
  - Uses JWT to manage sessions and authentication
- `/me` will take you to currently logged in user's profile page
  - Profile page you can change roles
  - Logout
  - If contributing
    - Add person button
    - Add movie button
  - Show recommended movies:
    - On server it creates a temporary [`Set`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set) to store different movies. Set allows to exclude all duplicates.
    - Add the following movies
      - You like
      - Users like (the users you follow)
      - People you follow
    - Remove the following movies
      - You dislike
      - Users dislike (the users you follow)
    - Now we have a set of all the movies a user might be interested in.
      - Shuffle the array so each time results loo unique
      - Slice the array and send few entries down
  - Show list of recently like movies
  - Show list of recently disliked movies
- Followers button will take them to `/profile/USER_ID/followers` to view all user who follow them.
- Following button will take them to `/profile/USER_ID/following` to view all people and users they follow.
- User can go to other people or user profiles and choose to Follow/UnFollow
- `/profile/:userId`
  - Profiles of other users

### Movies

- `/movies`
  - Show listing of all movies
  - API supports offset based pagination which allows to send limited data and go to next page if needed
    - Sorted in ascending order of titles
  - There is a next page button that you can click to go next page
  - This route can handle different query params.
    - `limit`
    - `title`
    - `offset`
    - `genre`
  - These values are read in and sent to backend.
  - Ability to pass in query params like this makes it very dynamic. This page can be used to generate various types of results.
- `/movies/:movieId`
  - Basic movie info
  - Genre keyword which user can click and navigate around and explore new movies
  - Clicking Director/Writer/Actor will take you to their profile page. See [people section](#people) for more details on people profile.
  - Shows listing of similar movies
    - On backend
      - It queries the DB with the genres labeled to the current movie
      - `.limit()` and `.skip()` allow to get randomized search results which are then sent to client.
  - Any user can
    - View reviews - if available for that movie
    - View star ratings - if available for that movie
  - Only logged in users can
    - Write reviews - detailed review
    - Rate the movies - stars out of 10
    - Like/Dislike
- `/movies/create`
  - Only for contributing users. Allows them to add new movie.
- `/movies/genres`
  - List of all different genres available
  - Clicking on a genre will take to `/movies?genre=VALUE` and show the results for `VALUE`
- Does not allow contributing user to edit movie

### People

- `/people`
  - List of all people (Directors/Actors/Writers) available
    - API supports offset based pagination since there are more than 27K people
    - List is sorted in ascending order of names
  - The results are paginates so you can navigate around
  - Accepts `?offset` as query param on frontend which is passed to backend
- `/people/:personId`
  - Show name
  - Follow/UnFollow button
  - List of movies they have worked on
  - Does not show frequent collaborators
- `/people/create`
  - Only for contributing users. Allows them to add new movie.

### Notifications

- If user follows a person and that person gets added to a new movie. A notification is generated for the user and stored in DB
- If user X follows user Y, user X should receive a notification any time user Y creates a new review. A notification is generated for user X and stored in DB.
- On client, it does long polling to grab the latest notifications from the DB for logged in user.
- Marking a notification read on client deletes it from the DB since it is no longer needed.

### API Documentation

All routes for backend are documented. Checkout [README](backend/README.md) in `backend` folder for more details.

### DB Initialization Scripts

These were designed to read the flat [JSON dataset](dataset/README.txt) provided and convert them into documents for mongo that and are linked using [ObjectID's](https://docs.mongodb.com/manual/reference/method/ObjectId/).
The script connects to DB and use the schema designed for DB and inserts them into mongodb. These are not fully automated there are changes that need to be made to mongo schema since this is a multi step process that does pre-processing, initializing and cleaning. The first step is to add all the movies into movies collection. Then add all the people to peoples collection. Since the field is unique that strips out all the duplicates. Since all the names of people are unique we loop over the movies collection and replace all actors/directors/writers names with the Object ID (as a string). Then need to update schema so it is Object ID instead of string and then we loop over all of the movie collections and type cast the string as ObjectID for mongo. This process can be improved and can be converted to one click script that magically takes care of everything.

## Extensions

- React: A JavaScript library for building user interfaces. React makes it easier to make high quality components with its declarative nature. The idea of making encapsulated components makes it easier to compose complex UIs. The [Flux architecture](https://facebook.github.io/flux/) that complements React composable view system by utilizing unidirectional flow of data so there is one source of truth which makes state management easier compared to MVC. I am also using techniques like [code splitting](https://reactjs.org/docs/code-splitting.html) using `React.lazy` this reduces the page size and then wrapping that with `React.Suspense` improve the UX by showing loading indicators.
- Database: Uses [MongoDB](https://www.mongodb.com) as the database
- Mobile Friendly: Implemented an adaptive interface for different screen size.
- Visually Impressive: Using CSS styling and accessible color theme it makes the frontend look nice.
- TypeScript: JavaScript's type system is not that good and it is very easy to have bugs in code. TypeScript is super set of JavaScript that adds type checking. It infers types and checks for errors that otherwise can get missed.
- Docker: I have designed this app as micro services a frontend, backend and the database. The database is running in a docker container. `docker-compose` is used to orchestrate the containers.

## Design Decisions

- Express
  - [ExpressJS](http://expressjs.com) makes it easier to write web app that are robust. There are many tools in the ecosystem that make is easy to develop APIs and is fast.
  - Have pure functions makes it easier to have them do one specific thing
  - Composing different functions makes it easier to do many things.
  - I found that querying users by ID or finding multiple items I was doing same thing over and over so I made my custom utility function that encapsulate the login and make it easier to read code.
  - I also made middleware for handling errors throughout the application. In my handlers I just had to call next with message and status code otherwise the handler will decide.
    - That also allowed me to append useful information to the errors thrown which can help with debugging.
- Mongo Collections: By designing a good schema and splitting the data in different collections makes it fast and robust. Having small documents also help mongo with querying and searching. The fields that I use frequently like movie title, genre or name of person are indexed when they are inserted which improves efficiency of mongodb. Having a good schema also ensured that fields inserted in database are always consistent.
- Reusable components
  - React makes it easier to design UI components as simple JS functions
  - I wrote all my components with functional approach (using hooks) and that makes it very easy to share code and also helps with code readability
  - Code splitting allows to reduce the page load size and send only necessary page data.
  - Then we inclemently get other page data as and when needed
    - There is still lot of place to improve
- TailwindCSS
  - This is utility first CSS lib. This allows to compose multiple utils into one as classnames.
  - This can help reduce the CSS size for the project.
    - All the class names not used are removed from final bundle
  - There are no scoping issues with CSS
  - Styling is dead simple and everything can be design with mobile first approach since adding media queries is as simple as calling a class name.
- Data fetching
  - Using a library like [SWR](https://swr.vercel.app) that is designed to work with react hooks makes it easy to fetch data.
  - This takes care of caching on client which helps with performance on frontend.
- Linting
  - Static Analysis tools like eslint help ensure good quality code, less bugs and consistent patterns throughout the codebase.
  - This helps find issues that might not be visible immediately.

## Improvements

### Caching

- Backend
  - Caching helps with read speed of data
  - Implementing solution like [redis](https://redis.io) for caching all the requests made to can help significantly speed up the GET requests.
  - This can also help optimize queries for finding recommendations for user or finding similar movies.
- Frontend
  - There is some caching done using SWR but more can be done
  - Currently the paginated results are not cached at all.
  - Having a shared data store on frontend for cached results can help improved performance and reduce the load from server even more.
    - Since the data for movie page and list movies is identical.
    - For example we can cache list of movies and to show them on a page we can retrieve them from the local cache on browser instead of making a network call

### Authentication

- The current auth setup can be improved
- Currently the tokens are used between frontend and backend as an exchange medium to authenticate users.
- Then frontend auth is what decide if user can do certain actions and this is not secure.
- Having backend handled the JWT on every request by passing in `Bearer TOKEN` in each request can help improve auth.

### Notifications

- Current long polling is done and it notifications system is very write heavy
- Use websocket for publishing notifications
- Use redis as a publication and subscriber system

### Over-fetching/Under-fetching

- Currently either it returns too much data that goes unused or too little that we need to make a second network request
- Implementing GraphQL native API can help us design this system even better.
  - We can fix over/under fetching issues
  - Get a strongly typed system
  - Better data fetching on client with libraries like Relay or Apollo Client

## Modules

- React: See [extensions section](#extensions)
- TypeScript: See [extensions section](#extensions)
- Tailwind: See [design decisions section](#design-decisions)
- swr: See [design decisions section](#design-decisions)
- ESLint: See [design decisions section](#design-decisions). There are plugins that eslint needs to work with.
- Lodash: Utility library for JS that has preformat and modular functions. I used these to help process the JSON files since many of these would be just finding on google and using them. These functions come with all the error checking and are there to solve these small things.
- Formik: Library for building forms in react. There is boiler plate code that goes in making a form in react to handle values, errors , visited fields. This helps encapsulates all that boiler plate and let's me focus on creating a simple form.
- Yup: This is used with Formik for error checking and validation on fields. Since there are many cases to cover in error checking and there is a lot of code that goes in. Instead of writing 100s of lines I just use this package to make it easy, readable and maintainable.
- bcryptjs: Used for hashing passwords in DB
- @reach/router: This is used in the frontend for client side routing. Instead of manipulating the DOM myself and managing the state of route. This library makes it easier for me to focus on developing the app rather than spending time and working with [Location API](https://developer.mozilla.org/en-US/docs/Web/API/Location)
- react-icons: High Quality SVG's that work with react
- react-toast-notifications: Makes it easier to pop in notifications
- Since I am using TypeScript there are `@types` for projects that are not written in TypeScript.

## Final Thoughts

I liked working on this project. I got a chance to explore various different tools. I just loved it when I hooked up frontend with my backend and everything just magically works!

I would say the recommendation of movies is the best feature. Yes there is a lot that needs to go in but having the ability to pipe in data from a social graph and then making one output excites me. There is a lot I have learned and if I get to do something similar I know what things not to do.

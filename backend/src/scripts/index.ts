//@ts-nocheck
// import data from "../../dataset/movie-data.json"
import data from '../movie-data.json';
// import data from "../movie-data";
import { camelCase } from "lodash";
import fs from "fs";
import { v4 } from "uuid";
import Models from "../models/index";
import mongoose from "mongoose";

// Check `db.png` for different keys
const movieCollectionKeys = [
  "title",
  "year",
  "director",
  "writer",
  "poster",
  "production",
];

/**
 * Returns an array from list items
 * @param {String} list comma separated list
 */
export const List = (list) => {
  if (!list) return [];
  return list.split(",").map((word) => word.trim()) || list;
};

/**
 * Returns a string without information in parenthesis
 * @param {String} word string that contains `()`
 */
const StripParens = (word) => {
  return word.split("(")[0].trim();
};

const peopleKeys = ["writer", "director", "actor"];

const setObj = (list, filterKeys) => {
  data.map((obj) => {
    Object.keys(obj)
      .filter((key) => filterKeys.includes(key))
      .forEach((key) => {
        let temp = { id: v4() };
        List(obj[key])
          .map((a) => StripParens(a))
          .forEach((name) => {
            let updateIndex = null;
            list.map((a, i) => (a.name === name ? (updateIndex = i) : null));
            if (updateIndex == null) {
              temp = {
                ...temp,
                name: name,
                role: {
                  ...temp.role,
                  [key]: [obj["id"]],
                },
              };
            } else {
              list[updateIndex] = {
                ...list[updateIndex],
                role: {
                  ...list[updateIndex].role,
                  [key]: [obj["id"]],
                },
              };
            }
          });

        list.push(temp);
      });
  });
};

const peopleList = [];
setObj(peopleList, peopleKeys);
// peopleList.map((a) => console.log(a))

const includeInMovieCollection = [
  "id",
  "title",
  "year",
  "director",
  "writer",
  "actors",
  "poster",
  "production",
];

const imdbCollection = ["imdbId", "imdbRating", "imdbVotes"];

const includeInMovieMetaCollection = [
  "plot",
  "language",
  "country",
  "released",
  "runtime",
  "genre",
  "metascore",
  ...imdbCollection,
];

const topLevelClean = (list, topLevelFilters, metaDataFilters) => {
  data.map(async (obj) => {
    let temp = {};
    // await new Promise(a => setTimeout(a,40))
    // Top Level stuff
    Object.keys(obj)
      .filter((key) => topLevelFilters.includes(camelCase(key)))
      .forEach((key) => {
        // // Since these are Comma separated store them as an array for easy access
        // if (["writer", "director", "actors"].includes(key)) {
        //   temp = {
        //     ...temp,
        //     [camelCase(key)]: List(obj[key]).map((w) => StripParens(w)),
        //   };
        // } else {
        //   temp = {
        //     ...temp,
        //     [camelCase(key)]: obj[key],
        //   };
        // }
           temp = {
            ...temp,
            [camelCase(key)]: obj[key],
          };
      });

    // MovieMeta Collection
    let movieMetaTemp = {};
    let imdbTemp = {};
  //  await new Promise(a => setTimeout(a,40))
    Object.keys(obj)
      .filter((key) => metaDataFilters.includes(camelCase(key)))
      .forEach((key) => {
        //   IMDB Collection
        if (imdbCollection.includes(camelCase(key))) {
          imdbTemp = {
            ...imdbTemp,
            [camelCase(key)]: obj[key],
          };

          movieMetaTemp = {
            ...movieMetaTemp,
            imdb: {
              ...imdbTemp,
            },
          };
        }
        // should be an array
        // else if (["genre", "Language"].includes(key)) {
        //   temp = {
        //     ...temp,
        //     [camelCase(key)]: List(obj[key]),
        //   };
        // } 
        else {
          movieMetaTemp = {
            ...movieMetaTemp,
            [camelCase(key)]: obj[key],
          };
        }

        // Update the main object
        temp = {
          ...temp,
          meta: {
            ...movieMetaTemp,
          },
        };
      });
    // temp = {
    //   ...temp,
    // }
    // console.log(temp.meta.metascore === 'N/A' ? 0: temp.meta.metascore )
    // console.log(temp.meta.genre)
    const meta = new Models.MovieMetaModel({
      plot: temp.meta.plot,
      language: temp.meta.language,
      country: temp.meta.country,
      releaseDate: temp.meta.released,
      metaScore:
      temp.meta.metascore === "N/A" ? 0 : parseInt(temp.meta.metascore),
      imdb: {
        imdbId: temp.meta.imdb.imdbId,
        votes: parseInt(temp.meta.imdb.imdbVotes),
        rating: temp.meta.imdb.imdbRating,
      },
    });

    const saveMeta = await meta.save();
    // console.log(meta)
    // console.log(saveMeta._id);
    // console.log(temp.meta.imdb.imdbVotes);
    const movie = new Models.MovieModel({
      title: temp.title,
      year: temp.year,
      poster: temp.poster,
      production: temp.production || "N/A",
      genre: List(temp.meta.genre),
      directors: List(temp.director).map((w) => StripParens(w)),
      actors: List(temp.actors).map((w) => StripParens(w)),
      writers: List(temp.writer).map((w) => StripParens(w)),
      meta: saveMeta._id,
    });

    const saveMovie = await movie.save();
    // console.log(movie)
    console.log(`Inserted movie ${saveMovie.title} : ${saveMovie._id} and meta: ${saveMeta._id}`);
    // list.push(temp)
  });
};

const moviesCollection = (topLevelFilters, metaDataFilters) => {
  data.map(async (obj) => {
    let temp = {};
    // Top Level stuff
    Object.keys(obj)
      .filter((key) => topLevelFilters.includes(camelCase(key)))
      .forEach((key) => {
           temp = {
            ...temp,
            [camelCase(key)]: obj[key],
          };
      });

    // MovieMeta Collection
    let movieMetaTemp = {};
    let imdbTemp = {};
    Object.keys(obj)
      .filter((key) => metaDataFilters.includes(camelCase(key)))
      .forEach((key) => {
        //   IMDB Collection
        if (imdbCollection.includes(camelCase(key))) {
          imdbTemp = {
            ...imdbTemp,
            [camelCase(key)]: obj[key],
          };

          movieMetaTemp = {
            ...movieMetaTemp,
            imdb: {
              ...imdbTemp,
            },
          };
        }        else {
          movieMetaTemp = {
            ...movieMetaTemp,
            [camelCase(key)]: obj[key],
          };
        }

        // Update the main object
        temp = {
          ...temp,
          meta: {
            ...movieMetaTemp,
          },
        };
      });

    const meta = new Models.MovieMetaModel({
      plot: temp.meta.plot,
      language: temp.meta.language,
      country: temp.meta.country,
      releaseDate: temp.meta.released,
      metaScore:
      temp.meta.metascore === "N/A" ? 0 : parseInt(temp.meta.metascore),
      imdb: {
        imdbId: temp.meta.imdb.imdbId,
        votes: parseInt(temp.meta.imdb.imdbVotes),
        rating: temp.meta.imdb.imdbRating,
      },
    });

    const saveMeta = await meta.save();

    const movie = new Models.MovieModel({
      title: temp.title,
      year: temp.year,
      poster: temp.poster,
      production: temp.production || "N/A",
      genre: List(temp.meta.genre),
      directors: List(temp.director).map((w) => StripParens(w)),
      actors: List(temp.actors).map((w) => StripParens(w)),
      writers: List(temp.writer).map((w) => StripParens(w)),
      meta: saveMeta._id,
    });

    const saveMovie = await movie.save();
    console.log(`Inserted movie ${saveMovie.title} : ${saveMovie._id} and meta: ${saveMeta._id}`);
  });
};


const test = [];

const start = async () => {
  // Connect to DB
  try {
    await mongoose.connect("mongodb://root:toor@localhost:27017", {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    console.error("Unable to connect to MongoDB");
    process.exit(126);
  }

  // const movies = await Models.MovieModel.find().populate('meta')

  // console.log(movies)
  moviesCollection(includeInMovieCollection, includeInMovieMetaCollection);
};

start();

// console.log(test)
// fs.writeFileSync(`${__dirname}/test.json`, JSON.stringify(test))

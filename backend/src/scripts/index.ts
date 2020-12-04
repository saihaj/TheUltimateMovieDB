//@ts-nocheck
// import data from "../../dataset/movie-data.json"
// import data from '../movie-data.json';
import data from "../movie-data";
import { camelCase, compact, template } from "lodash";
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

const peopleKeys = ["writer", "director", "actors"];

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

/**
 * Increments a value in array
 * @param list Array
 * @param val value to increment
 */
const freqCollabUpdate = (list, val) => {
  const tempArr = [];

  list.map((a) => {
    let temp = a;
    if (a.person === val) {
      temp = {
        ...a,
        count: ++a.count,
      };
    }
    tempArr.push(temp);
  });

  if (!tempArr.find(({ person }) => person === val)) {
    tempArr.push({
      person: val,
      count: 1,
    });
  }

  return tempArr;
};

// const peopleList = [];
// setObj(peopleList, peopleKeys);
// console.log(peopleList)
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

const personCollection = (people) => {
  let ctr = 0;
  data.map(async (obj) => {
    let temp = {};
    // await new Promise(a => setTimeout(a,40))
    // Top Level stuff
    Object.keys(obj)
      .filter((key) => people.includes(camelCase(key)))
      .forEach((key) => {
        temp = {
          ...temp,
          [camelCase(key)]: List(obj[key]).map((a) => StripParens(a)),
        };
      });

    [...temp.director, ...temp.writer, ...temp.actors].map(async (name) => {
      try {
        const searchPerson = await Models.People.find({ name: name });
        await new Promise((a) => setTimeout(a, 80));
        if (searchPerson.length == 0) {
          const person = await new Models.People({ name }).save();
          console.log(`${ctr} Inserted ${name} with ID ${person._id}`);
          ctr++;
        } else {
          console.log(`${name} exists!`);
        }
      } catch (err) {
        console.error(err);
      }
    });
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
        } else {
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
    console.log(
      `Inserted movie ${saveMovie.title} : ${saveMovie._id} and meta: ${saveMeta._id}`
    );
  });
};

const relateMovieWriterToPersons = async () => {
  const movies = await Models.MovieModel.find();
  movies.map((a) => {
    const tempId = [];
    Promise.all(
      a.writers.map(
        async (name) =>
          await Models.People.findOneAndUpdate(
            { name },
            { $push: { writer: a._id } }
          ).exec()
      )
    ).then(async (b) => {
      b.map((x) => tempId.push(x._id));

      await Models.MovieModel.updateOne(
        { _id: a._id },
        { $set: { writers: tempId } }
      ).exec();
      console.log(`Updated writers ${a.title}`);
    });
  });
};

const relateMovieActorToPersons = async () => {
  const movies = await Models.MovieModel.find();
  movies.map((a) => {
    const tempId = [];
    Promise.all(
      a.actors.map(
        async (name) =>
          await Models.People.findOneAndUpdate(
            { name },
            { $push: { actor: a._id } }
          ).exec()
      )
    ).then(async (b) => {
      b.map((x) => tempId.push(x._id));
      await Models.MovieModel.updateOne(
        { _id: a._id },
        { $set: { actors: tempId } }
      ).exec();
      console.log(`Updated actor ${a.title}`);
    });
  });
};

const relateMovieDirectorsToPersons = async () => {
  const movies = await Models.MovieModel.find();
  movies.map((a) => {
    const tempId = [];
    Promise.all(
      a.directors.map(
        async (name) =>
          await Models.People.findOneAndUpdate(
            { name },
            { $push: { director: a._id } }
          ).exec()
      )
    ).then(async (b) => {
      b.map((x) => tempId.push(x._id));
      await Models.MovieModel.updateOne(
        { _id: a._id },
        { $set: { directors: tempId } }
      ).exec();
      console.log(`Updated director ${a.title}`);
    });
  });
};

const updateActorObjectId = async () => {
  const movies = await Models.MovieModel.find();
  movies.map(async (a) => {
    const tempId = [];
    a.actors.map((b) => tempId.push(mongoose.Types.ObjectId(b)));
    await Models.MovieModel.updateOne(
      { _id: a._id },
      { $set: { actors: tempId } }
    ).exec();
    console.log(`Updated actors ${a.title}`);
  });
};

const updateWriterObjectId = async () => {
  const movies = await Models.MovieModel.find();
  movies.map(async (a) => {
    const tempId = [];
    a.writers.map((b) => tempId.push(mongoose.Types.ObjectId(b)));
    await Models.MovieModel.updateOne(
      { _id: a._id },
      { $set: { writers: tempId } }
    ).exec();
    console.log(`Updated writer ${a.title}`);
  });
};

const updateDirectorObjectId = async () => {
  const movies = await Models.MovieModel.find();
  movies.map(async (a) => {
    const tempId = [];
    a.directors.map((b) => tempId.push(mongoose.Types.ObjectId(b)));
    await Models.MovieModel.updateOne(
      { _id: a._id },
      { $set: { directors: tempId } }
    ).exec();
    console.log(`Updated director ${a.title}`);
  });
};

const freqCollabs = async () => {
  const movies = await Models.MovieModel.find();

  movies.splice(0, 1).map(async (a) => {
    const collabs = [...a.directors, ...a.writers, ...a.actors];
    let temp = [];
    Promise.all(
      collabs.map(async (id) => {
        const person = await Models.People.findById(id);
        // Skip self
        if (person._id !== id) {
          temp = [...temp, ...freqCollabUpdate(person.collaborators, id)];
        }
      })
    ).then((a) => {console.log(temp)});
  });
};

const testing = [
  { person: "John", count: 1 },
  { person: "James", count: 3 },
  { person: "Ron", count: 1 },
];

const start = async () => {
  // Connect to DB
  try {
    await mongoose.connect("mongodb://localhost:27017/freqCollabs", {
      useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log(err);
    console.error("Unable to connect to MongoDB");
    process.exit(126);
  }

  // const movies = await Models.MovieModel.find();
  // const movies = await Models.MovieModel.findOne({title:"Toy Story"}).populate("directors")
  // console.log(movies);
  // const searchPerson = await Models.People.findOne({
  //   name: "Andrew Stanton",
  // }).populate("writer");
  // console.log(searchPerson);
  // console.log(movies);

  // moviesCollection(includeInMovieCollection, includeInMovieMetaCollection);
  // personCollection(peopleKeys);
  // relateMovieWriterToPersons();
  // relateMovieActorToPersons();
  // relateMovieDirectorsToPersons();
  // updateWriterObjectId();
  // updateActorObjectId();
  // updateDirectorObjectId();
  freqCollabs();
};

start();

// import data from '../../dataset/movie-data.ts'
import data from "./movie-data"
import { camelCase } from "lodash"
import fs from "fs"

// Check `db.png` for different keys
const movieCollectionKeys = [
  "title",
  "year",
  "director",
  "writer",
  "poster",
  "production",
]

/**
 * Returns an array from list items
 * @param {String} list comma separated list
 */
export const List = (list) => {
  if (!list) return []
  return list.split(",").map((word) => word.trim()) || list
}

/**
 * Returns a string without information in parenthesis
 * @param {String} word string that contains `()`
 */
const StripParens = (word) => {
  return word.split("(")[0].trim()
}

const setObj = (list, filterKey) => {
  data.map((obj) => {
    Object.keys(obj)
      .filter((key) => key === filterKey)
      .forEach((key) => {
        List(obj[key])
          .map((a) => StripParens(a))
          .forEach((name) => {
            list.push({
              name: name,
              role: filterKey,
            })
          })
      })
  })
}

// const writersList = []
// // const actorsList = []
// setObj(writersList, "writer")
// // setObj(actorsList, 'actors')

// console.log("List of writers object")
// console.log(writersList)

// console.log("\nList of actors object")
// console.log(actorsList)

const includeInMovieCollection = [
  "id",
  "title",
  "year",
  "director",
  "writer",
  "actors",
  "poster",
  "production",
]

const imdbCollection = ["imdbId", "imdbRating", "imdbVotes"]

const includeInMovieMetaCollection = [
  "plot",
  "language",
  "country",
  "released",
  "runtime",
  "genre",
  "metascore",
  ...imdbCollection,
]

const topLevelClean = (list, topLevelFilters, metaDataFilters) => {
  data.map((obj) => {
    let temp = {}
    // Top Level stuff
    Object.keys(obj)
      .filter((key) => topLevelFilters.includes(camelCase(key)))
      .forEach((key) => {
        // Since these are Comma separated store them as an array for easy access
        if (["writer", "director", "actors"].includes(key)) {
          temp = {
            ...temp,
            [camelCase(key)]: List(obj[key]).map((w) => StripParens(w)),
          }
        } else {
          temp = {
            ...temp,
            [camelCase(key)]: obj[key],
          }
        }
      })

    // MovieMeta Collection
    let movieMetaTemp = {}
    let imdbTemp = {}
    Object.keys(obj)
      .filter((key) => metaDataFilters.includes(camelCase(key)))
      .forEach((key) => {
        //   IMDB Collection
        if (imdbCollection.includes(camelCase(key))) {
          imdbTemp = {
            ...imdbTemp,
            [camelCase(key)]: obj[key],
          }

          movieMetaTemp = {
            ...movieMetaTemp,
            imdb: {
              ...imdbTemp,
            },
          }
        } else {
          movieMetaTemp = {
            ...movieMetaTemp,
            [camelCase(key)]: obj[key],
          }
        }

        // Update the main object
        temp = {
          ...temp,
          meta: {
            ...movieMetaTemp,
          },
        }
      })

    list.push(temp)
  })
}

const test = []

topLevelClean(test, includeInMovieCollection, includeInMovieMetaCollection)
console.log(test)
// fs.writeFileSync(`${__dirname}/test.json`, JSON.stringify(test))

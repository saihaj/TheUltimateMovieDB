// import data from '../../dataset/movie-data.ts'
import data from "./movie-data"
import { camelCase } from "lodash"
import fs from "fs"
import { v4 } from "uuid"

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

const peopleKeys = ["writer", "director", "actor"]

const setObj = (list, filterKeys) => {
  data.map((obj) => {
    Object.keys(obj)
      .filter((key) => filterKeys.includes(key))
      .forEach((key) => {
        let temp = { id: v4() }
        List(obj[key])
          .map((a) => StripParens(a))
          .forEach((name) => {
            let updateIndex = null
            list.map((a, i) => (a.name === name ? (updateIndex = i) : null))
            if (updateIndex == null) {
              temp = {
                ...temp,
                name: name,
                role: {
                  ...temp.role,
                  [key]: [obj["id"]],
                },
              }
            } else {
              list[updateIndex] = {
                ...list[updateIndex],
                role: {
                  ...list[updateIndex].role,
                  [key]: [obj["id"]],
                },
              }
            }
          })

        list.push(temp)
      })
  })
}

const peopleList = []
setObj(peopleList, peopleKeys)
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

    temp = {
      ...temp,
      id: v4(),
    }
    list.push(temp)
  })
}

const test = []

topLevelClean(test, includeInMovieCollection, includeInMovieMetaCollection)
console.log(test)
// fs.writeFileSync(`${__dirname}/test.json`, JSON.stringify(test))

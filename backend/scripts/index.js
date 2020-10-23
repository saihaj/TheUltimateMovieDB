// import data from '../../dataset/movie-data.ts'
import data from '../src/movie-data.ts'

// Check `db.png` for different keys
const movieCollectionKeys = ['title', 'year', 'director', 'writer', 'poster', 'production']

const setObj = (list, filterKey) => {
    data.map(obj => {
        Object
            .keys(obj)
            .filter(key => key === filterKey)
            .forEach(key => {
                const temp = {
                    name: obj[key],
                    role: filterKey
                }
                list.push(temp)
            })
    })
}

const writersList = []
const actorsList = []
setObj(writersList,'writer')
setObj(actorsList, 'actors')

console.log("List of writers object")
console.log(writersList)

console.log("\nList of actors object")
console.log(actorsList)
import axios from 'axios'

let base_url
if (process.env.NODE_ENV === 'production') {
    base_url = 'https://type-racer-sandy.vercel.app/api'
} else {
    base_url = 'http://localhost:8080/api'
}

export const getScoresByUserId = async (userId) => {
    const { data } = await axios.get(base_url + `/scores?userId=${userId}`)
    return data
}
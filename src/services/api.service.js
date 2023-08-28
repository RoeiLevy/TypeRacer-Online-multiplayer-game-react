import axios from 'axios'
const base_url = 'http://localhost:8080'
export const getScoresByUserId = async (userId) => {
    const { data } = await axios.get(base_url + `/scores?userId=${userId}`)
    return data
}
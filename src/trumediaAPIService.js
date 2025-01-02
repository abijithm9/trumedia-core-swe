import axios from 'axios'

const BASE_URL = `https://project.trumedianetworks.com/api`
const API_KEY = '099a15bf-a375-42fd-adec-61e855dd6ad0'
async function getToken() {
    // console.log("process.env.API_KEY: ",process.env.API_KEY)
    return await axios.get(
        `${BASE_URL}/token`,
        {
            'headers': { 
                'accept': 'application/json', 
                'apiKey': API_KEY,
                'Access-Control-Allow-Origin': "*"
            }
        }
    )
}

export async function getPlayers(){
    const tokenResponse = await getToken()
    const token = await tokenResponse.data.token;
    return await axios.get(
        `${BASE_URL}/mlb/players`,
        {
            'headers': { 
                'accept': 'application/json', 
                'tempToken': token,
                'Access-Control-Allow-Origin': "*"
            }
        }
    )
}

export async function getPlayerGameLogs(playerId) {
    const tokenResponse = await getToken()
    const token = await tokenResponse.data.token;
    return await axios.get(
        `${BASE_URL}/mlb/player/${playerId}`,
        {
            'headers': { 
                'accept': 'application/json', 
                'tempToken': token,
                'Access-Control-Allow-Origin': "*"
            }
        }
    )
}
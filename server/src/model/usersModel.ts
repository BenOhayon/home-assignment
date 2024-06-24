import fs from 'fs'
import { USERS_DATA_FILENAME } from '../constants/general.constants'

 //////////
// NOTE //
/////////
// All DB calls can be optimized using cache.
// Every time the DB is changed, it updates the cache and all DB readings will be from the cache only.
// It's not implemented due to lack of time

export async function getAllUsers(): Promise<object[]> {
    try {
        const usersString = fs.readFileSync(USERS_DATA_FILENAME, 'utf8')
        return JSON.parse(usersString)
    } catch (error) {
        throw error
    }
}
import config from '../config'
import { USERS_API_ROUTE } from '../constants/api.constants'
import { UserData } from '../types'
import { requestGet } from './apiUtils'

const BASE_URL = config.environment().baseUrl

/**
 * Retrieves all the users.
 * 
 * Method: GET
 * URL: /users
 */
export async function getAllUsers(): Promise<UserData[]> {
    try {
        const url = `${BASE_URL}${USERS_API_ROUTE}`
        const users = await requestGet(url)

        return users.map((user: UserData) => ({
            id: user?.id,
            name: user?.name,
            avatar: user?.avatar,
            likedPosts: users?.likedPosts ?? []
        }))
    } catch (error) {
        throw error
    }
}
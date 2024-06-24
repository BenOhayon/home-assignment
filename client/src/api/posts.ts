import config from '../config'
import { LIKED_USERS_API_ROUTE, LIKE_API_ROUTE, NEW_API_ROUTE, POSTS_API_ROUTE } from '../constants/api.constants'
import { PostData, UserData } from '../types'
import { requestDelete, requestGet, requestPost, requestPut } from './apiUtils'

const BASE_URL = config.environment().baseUrl

/**
 * Retrieves all the posts.
 * 
 * Method: GET
 * URL: /posts
 */
export async function getAllPosts(): Promise<PostData[]> {
    try {
        const url = `${BASE_URL}${POSTS_API_ROUTE}`
        const posts = await requestGet(url)

        return posts.map((post: PostData) => ({
            id: post?.id,
            userId: post?.userId,
            content: post?.content,
            date: post?.date,
            imageUrl: post?.imageUrl ?? "",
            likesCounter: post?.likesCounter ?? []
        }))
    } catch (error) {
        throw error
    }
}

/**
 * Creates a post.
 * 
 * Method: POST
 * URL: /posts/new
 * 
 * Body Params:
 * ============
 * (*) userId - The ID of the user that created the post
 * (*) imageUrl - The image URL of the new post
 * (*) content - The content of the new post
 */
export async function addPost(userId: number, content: string, imageUrl?: string): Promise<PostData> {
    try {
        const options = {
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                userId,
                imageUrl,
                content
            })
        }
        const url = `${BASE_URL}${POSTS_API_ROUTE}${NEW_API_ROUTE}`

        return await requestPost(url, options)
    } catch (error) {
        throw error
    }
}

/**
 * Edits a post.
 * 
 * Method: PUT
 * URL: /posts/:id
 * 
 * Body Params:
 * ============
 * (*) id - The ID of the post
 * (*) date - The creation date of the post
 * (*) userId - The ID of the user that edited the post
 * (*) imageUrl - The image URL of the post
 * (*) content - The content of the post
 * (*) likesCounter - The likes counter of the post
 * 
 * Route Params:
 * =============
 * (*) id - The ID of the post
 */
export async function editPost(post: PostData): Promise<PostData> {
    try {
        const options = {
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                postId: post?.id,
                date: post?.date,
                userId: post?.userId,
                imageUrl: post?.imageUrl,
                content: post?.content,
                likesCounter: post?.likesCounter
            })
        }
        const url = `${BASE_URL}${POSTS_API_ROUTE}/${post?.id}`

        return await requestPut(url, options)
    } catch (error) {
        throw error
    }
}

/**
 * Deletes a post.
 * 
 * Method: DELETE
 * URL: /posts/:id
 * 
 * Route Params:
 * =============
 * (*) id - The ID of the post
 */
export async function deletePost(postId: number): Promise<PostData> {
    try {
        const url = `${BASE_URL}${POSTS_API_ROUTE}/${postId}`
        return await requestDelete(url)
    } catch (error) {
        throw error
    }
}

/**
 * Performs a like on a post.
 * If the request is sent from the same 'userId' more than once, it performs dislike on the post.
 * Otherwise, it keeps track of which 'userId' liked the post
 * 
 * Method: POST
 * URL: /posts/:id/like
 * 
 * Body Params:
 * ============
 * (*) userId - The ID of the user that edited the post
 * 
 * Route Params:
 * =============
 * (*) id - The ID of the post
 */
export async function performLike(postId: number, userId: number): Promise<PostData> {
    try {
        const options = {
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                userId
            })
        }
        const url = `${BASE_URL}${POSTS_API_ROUTE}/${postId}${LIKE_API_ROUTE}`

        return await requestPost(url, options)
    } catch (error) {
        throw error
    }
}

/**
 * Retrieves all the users that like a post.
 * 
 * Method: GET
 * URL: /posts/:id/liked_users
 * 
 * Route Params:
 * =============
 * (*) id - The ID of the post
 */
export async function getLikedUsers(postId: number): Promise<UserData[]> {
    try {
        const url = `${BASE_URL}${POSTS_API_ROUTE}/${postId}${LIKED_USERS_API_ROUTE}`
        return await requestGet(url)
    } catch (error) {
        throw error
    }
}
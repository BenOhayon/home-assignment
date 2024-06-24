import { POSTS_DATA_FILENAME, USERS_DATA_FILENAME } from '../constants/general.constants'
import { PostData, UserData } from '../types'
import fs from 'fs'
 //////////
// NOTE //
/////////
// All DB calls can be optimized using cache.
// Every time the DB is changed, it updates the cache and all DB readings will be from the cache only.
// It's not implemented due to lack of time

export async function getAllPosts(): Promise<object[]> {
    try {
        const postsString = fs.readFileSync(POSTS_DATA_FILENAME, 'utf8')
        return JSON.parse(postsString)
    } catch (error) {
        throw error
    }
}

export async function addPost(post: PostData): Promise<PostData> {
    try {
        const data = fs.readFileSync(POSTS_DATA_FILENAME, 'utf8')
        const currentPostsData = JSON.parse(data)
        const creationDate = new Date().toISOString()
        const id = currentPostsData.length === 0 ? 1 : currentPostsData[currentPostsData.length - 1].id + 1
        const newPost = {
            id,
            date: creationDate,
            userId: post?.userId,
            content: post?.content,
            imageUrl: post?.imageUrl,
            likesCounter: 0
        }

        currentPostsData.push(newPost)
        const newStringifiedJsonData = JSON.stringify(currentPostsData)
        fs.writeFile(POSTS_DATA_FILENAME, newStringifiedJsonData, error => { throw error })
        return newPost
    } catch (error) {
        throw error
    }
}

export async function deletePost(postId: number): Promise<void> {
    try {
        const data = fs.readFileSync(POSTS_DATA_FILENAME, 'utf8')
        let currentPostsData = JSON.parse(data)
        currentPostsData = currentPostsData.filter((post: PostData) => post?.id !== postId)
        const newStringifiedJsonData = JSON.stringify(currentPostsData)
        fs.writeFile(POSTS_DATA_FILENAME, newStringifiedJsonData, error => { throw error })
        return
    } catch (error) {
        throw error
    }
}

export async function editPost(newPost: PostData): Promise<void> {
    try {
        const data = fs.readFileSync(POSTS_DATA_FILENAME, 'utf8')
        const currentPostsData = JSON.parse(data)
        const postIndex = currentPostsData.findIndex((post: PostData) => post?.id === newPost?.id)
        if (postIndex === -1) {
           throw "Invalid post ID"
        }
        currentPostsData.splice(postIndex, 1, newPost)
        const newStringifiedJsonData = JSON.stringify(currentPostsData)
        fs.writeFile(POSTS_DATA_FILENAME, newStringifiedJsonData, error => { throw error })
        return
    } catch (error) {
        throw error
    }
}

export async function performLike(postId: number, userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.readFile(POSTS_DATA_FILENAME, 'utf8', (err1, rawPosts) => {
            fs.readFile(USERS_DATA_FILENAME, 'utf8', (err2, rawUsers) => {
                if (err1) {
                    console.log(err1)
                    reject(err1)
                } else if (err2) {
                    console.log(err2)
                    reject(err2)
                } else {
                    const posts = JSON.parse(rawPosts)
                    const users = JSON.parse(rawUsers)

                    const post = posts.find((post: PostData) => post?.id === postId)
                    const user = users.find((user: UserData) => user?.id === userId)
                    if (!post || !user) {
                        reject("Invalid post ID")
                        return
                    }

                    if (user?.likedPosts.includes(postId)) {
                        // dislike this post
                        const requestedPostIdIndex = user?.likedPosts.indexOf(postId)
                        if (requestedPostIdIndex === -1) {
                            reject("Invalid user ID")
                            return
                        }

                        user?.likedPosts.splice(requestedPostIdIndex, 1)
                        post.likesCounter--
                    } else {
                        // like this post
                        user?.likedPosts.push(postId)
                        post.likesCounter++
                    }
                    const newStringifiedPostsData = JSON.stringify(posts)
                    const newStringifiedUsersData = JSON.stringify(users)
                    fs.writeFile(POSTS_DATA_FILENAME, newStringifiedPostsData, reject)
                    fs.writeFile(USERS_DATA_FILENAME, newStringifiedUsersData, reject)
                    resolve()
                }
            })
        })
    })
}

export function getLikedUsers(postId: number): Promise<number[]> {
    return new Promise((resolve, reject) => {
        fs.readFile(USERS_DATA_FILENAME, 'utf8', (err, data) => {
            if (err) {
                console.log(err)
                reject(err)
            } else {
                const users = JSON.parse(data)
                resolve(users.filter((user: UserData) => user?.likedPosts.includes(postId)))
            }
        })
    })
}
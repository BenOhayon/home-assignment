import express, { Request, Response } from "express";
import { ResponseCodes } from "../types"
import SuccessResponse from "../responses/SuccessResponse";
import ErrorResponse from "../responses/ErrorResponse";
import { addPost, deletePost, editPost, getAllPosts, getLikedUsers, performLike } from "../model/postsModel";
const router = express.Router()

/**
 * Retrieves all the posts.
 * 
 * Method: GET
 * URL: /posts
 */
router.get("/", (req: Request, res: Response) => {
    getAllPosts()
        .then(posts => {
            if (posts.length === 0) {
                res.json(new ErrorResponse(ResponseCodes.NOT_FOUND, "No posts found").asJson())
            }
            res.json(new SuccessResponse(ResponseCodes.OK, posts).asJson())
        })
        .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
})

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
router.post('/new', (req: Request, res: Response) => {
    addPost({
        userId: req.body?.userId,
        content: req.body?.content,
        imageUrl: req.body?.imageUrl ?? ""
    })
        .then(newPost => res.json(new SuccessResponse(ResponseCodes.CREATED, newPost).asJson()))
        .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
})

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
router.post('/:id/like', (req: Request, res: Response) => {
    performLike(+req.params?.id, req.body?.userId)
        .then(() => res.json(new SuccessResponse(ResponseCodes.OK, null).asJson()))
        .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
})

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
router.get('/:id/liked_users', (req: Request, res: Response) => {
    getLikedUsers(+req.params?.id)
        .then(likedUsers => res.json(new SuccessResponse(ResponseCodes.OK, likedUsers).asJson()))
        .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
})

router
    .route('/:id')
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
    .delete((req: Request, res: Response) => {
        deletePost(+req.params?.id)
            .then(() => res.json(new SuccessResponse(ResponseCodes.OK, null).asJson()))
            .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
        })
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
     * 
     * Route Params:
     * =============
     * (*) id - The ID of the post
     */
    .put((req: Request, res: Response) => {
        const postForEdit = {
            id: req.body?.postId,
            userId: req.body?.userId,
            content: req.body?.content,
            date: req.body?.date,
            imageUrl: req.body?.imageUrl ?? "",
            likesCounter: req.body?.likesCounter
        }
        editPost(postForEdit)
            .then(() => res.json(new SuccessResponse(ResponseCodes.OK, postForEdit).asJson()))
            .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
    })

export default router
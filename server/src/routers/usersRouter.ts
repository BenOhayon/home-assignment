import express, { Request, Response } from "express";
import { getAllUsers } from '../model/usersModel'
import { ResponseCodes } from "../types"
import SuccessResponse from "../responses/SuccessResponse";
import ErrorResponse from "../responses/ErrorResponse";
const router = express.Router()

/**
 * Retrieves all the users.
 * 
 * Method: GET
 * URL: /users
 */
router.get("/", (req: Request, res: Response) => {
    getAllUsers()
        .then(users => {
            console.log(users)
            if (users.length === 0) {
                res.json(new ErrorResponse(ResponseCodes.NOT_FOUND, "No users found").asJson())
            } else {
                res.json(new SuccessResponse(ResponseCodes.OK, users).asJson())
            }
        })
        .catch(error => res.json(new ErrorResponse(ResponseCodes.INTERNAL_SERVER_ERROR, error).asJson()))
})

export default router
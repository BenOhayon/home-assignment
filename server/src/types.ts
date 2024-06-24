export enum ResponseCodes { 
    OK = 200,
    CREATED = 201,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export type PostData = {
    id?: number,
	userId: number,
	content: string,
	date?: string,
	imageUrl?: string,
    likesCounter?: number
};

export type UserData = {
	id: number;
	name: string;
	avatar?: string;
	likedPosts: number[]
};
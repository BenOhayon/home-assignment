export type PostData = {
	id: number,
	userId: number,
	content: string,
	date: string,
	imageUrl?: string,
	likesCounter: number
};

export type UserData = {
	id: number;
	name: string;
	avatar?: string;
	likedPosts: number[]
};

export type PostItemData = PostData & UserData

export enum ENVS {
	DEBUG = "debug",
	STAGING = "staging",
	PRODUCTION = "production"
}

export type EnvConfig = {
	baseUrl: string
}

export enum PostEditorMode { CREATE, EDIT }

export enum HTTPMethod { GET = 'GET', POST = 'POST', PUT = 'PUT', DELETE = 'DELETE' }

export type PostEditorData = {
	imageUrl?: string,
	content: string
}

export type PostEditorState = PostData & {
	mode: PostEditorMode
}

export type DeletePostDialogState = {
	isOpen: boolean,
	post: PostData | null,
	onConfirm: () => void
}

export type WithChildren = {
	children?: React.ReactNode
}

export type DataContextType = {
    users: UserData[],
    posts: PostData[]
}
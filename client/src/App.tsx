import { createContext, useContext, useEffect, useRef, useState } from "react";
import { PostData, PostEditorMode, UserData, PostEditorState, DeletePostDialogState, DataContextType } from "./types";
import { getAllUsers } from "./api/users";
import { getAllPosts } from "./api/posts";
import PostItem from "./components/PostItem/PostItem";
import './index.css'
import PostEditor from "./components/PostEditor/PostEditor";
import Header from "./components/Header/Header";
import { DIALOG_TRANSITION_DURATION_MILLISECONDS, HEADER_HEIGHT_PX } from "./constants/general.constants";
import DeletePostDialog from "./components/dialogs/DeletePostDialog/DeletePostDialog";

const postEditorStateInitialState = {
	id: 0,
	userId: 0,
	date: '',
	imageUrl: "",
	content: "",
	likesCounter: 0,
	mode: PostEditorMode.CREATE
}

const dataContextInitialState = {
	users: [],
	posts: []
}

const DataContext = createContext<DataContextType>(dataContextInitialState)

export function useDataContext() {
	return useContext(DataContext)
}

function App() {
	const [currentUser, setCurrentUser] = useState<UserData>({
		id: -1,
		name: "",
		avatar: "",
		likedPosts: []
	})
	const [users, setUsers] = useState<UserData[]>([])
	const [posts, setPosts] = useState<PostData[]>([])
	const [isPostEditorOpen, setIsPostEditorOpen] = useState(false)
	const [postEditorState, setPostEditorState] = useState<PostEditorState>(postEditorStateInitialState)
	const [deletePostDialogState, setDeletePostDialogState] = useState<DeletePostDialogState>({
		isOpen: false,
		post: null,
		onConfirm: () => { }
	})

	const randomizedNumbersFlagsRef = useRef<boolean[]>([])
	const shouldRandomizeUserRef = useRef(true)

	const openEditor = () => setIsPostEditorOpen(true)
	const closeEditor = () => {
		setIsPostEditorOpen(false)
		setTimeout(() => {
			setPostEditorState(prev => ({
				...postEditorStateInitialState,
				mode: prev?.mode
			}))
		}, DIALOG_TRANSITION_DURATION_MILLISECONDS)
	}

	useEffect(() => {
		getAllUsers()
			.then(users => {
				randomizedNumbersFlagsRef.current = new Array<boolean>(users.length).fill(false)
				setUsers(users)
			})
			.catch(console.log)

		getAllPosts()
			.then(posts => setPosts(posts))
			.catch(console.log)
	}, [])

	useEffect(() => {
		setPosts(posts.sort((post1: PostData, post2: PostData) => new Date(post2.date).getTime() - new Date(post1.date).getTime()))
	}, [posts])

	useEffect(() => {
		if (users && users.length > 0 && shouldRandomizeUserRef.current) {
			randomizeUser()
		}
	}, [users])

	function randomizeUser() {
		function allUsersGenerated() {
			return randomizedNumbersFlagsRef.current.reduce((result: boolean, isRandomized: boolean) => result && isRandomized, true)
		}

		function selectUser(userIndex: number, shouldUpdateFlagsArray: boolean) {
			if (shouldUpdateFlagsArray) {
				randomizedNumbersFlagsRef.current[userIndex] = true
			}
			setCurrentUser(users[userIndex])
		}

		shouldRandomizeUserRef.current = true
		let randomUserId = Math.floor(Math.random() * 10)
		if (allUsersGenerated()) {
			selectUser(randomUserId, false)
		} else if (!randomizedNumbersFlagsRef.current[randomUserId]) {
			selectUser(randomUserId, false)
		} else {
			// if the generated ID was already generated before all the IDs were generated then search the next ID that wasn't generated
			while (randomizedNumbersFlagsRef.current[randomUserId]) {
				randomUserId = (randomUserId + 1) % randomizedNumbersFlagsRef.current.length
			}
			selectUser(randomUserId, false)
		}
	}

	function startPostEdit(post: PostData) {
		setPostEditorState({
			id: post?.id,
			date: post?.date,
			userId: post?.userId,
			imageUrl: post?.imageUrl,
			content: post?.content,
			likesCounter: post?.likesCounter,
			mode: PostEditorMode.EDIT
		})
		openEditor()
	}

	function editPost(postForEdit: PostData) {
		const currentPosts = [...posts]
		const postIndex = currentPosts.findIndex((post: PostData) => post?.id === postForEdit?.id)
		if (postIndex === -1) {
			return
		}

		currentPosts.splice(postIndex, 1, postForEdit)
		setPosts(currentPosts)
	}

	function showDeletePostConfirmDialog(post: PostData) {
		setDeletePostDialogState({
			isOpen: true,
			post,
			onConfirm: () => removePost(post?.id)
		})
	}

	function removePost(postId: number) {
		const currentPosts = [...posts]
		const postIndex = currentPosts.findIndex((post: PostData) => post?.id === postId)
		if (postIndex === -1) {
			return
		}

		currentPosts.splice(postIndex, 1)
		setPosts(currentPosts)
	}

	function startPostCreate() {
		setPostEditorState({
			id: Math.max(...posts.map((post: PostData) => post?.id)) + 1,
			date: new Date().toISOString(),
			userId: currentUser?.id,
			imageUrl: "",
			content: "",
			likesCounter: 0,
			mode: PostEditorMode.CREATE
		})
		openEditor()
	}

	function createPost(post: PostData) {
		const currentPosts = [...posts]
		currentPosts.push(post)
		setPosts(currentPosts)
	}

	function closeDeleteDialog() {
		setDeletePostDialogState(prev => ({
			...prev,
			isOpen: false
		}))
	}

	function toggleLike(postId: number, userId: number) {
		const currentPosts = [...posts]
		const currentUsers = [...users]
		const post = currentPosts.find((post: PostData) => post?.id === postId)
		const user = currentUsers.find((user: UserData) => user?.id === userId)
		if (!post || !user) {
			return
		}

		console.log(user, post)
		if (user?.likedPosts.includes(postId)) {
			// dislike this post
			const postIdIndex = user?.likedPosts.indexOf(postId)
			user?.likedPosts.splice(postIdIndex, 1)
			post.likesCounter--
		} else {
			// like this post
			user?.likedPosts.push(postId)
			post.likesCounter++
		}

		shouldRandomizeUserRef.current = false
		setUsers(currentUsers)
		setPosts(currentPosts)
	}

	return (
		<DataContext.Provider value={{ users, posts }}>
			{currentUser?.id !== -1 && <Header user={currentUser} openPostEditor={startPostCreate} onAvatarClick={randomizeUser} />}
			<div className="posts-wrapper" style={{ paddingTop: `${HEADER_HEIGHT_PX + 20}px` }}>
				{
					posts.map(post => <PostItem
						key={post?.id}
						user={users.find((user: UserData) => user?.id === post?.userId) ?? {
							id: 0,
							name: "",
							avatar: "",
							likedPosts: []
						}}
						currentUserId={currentUser?.id}
						post={post}
						onEditPost={() => startPostEdit(post)}
						onDeletePost={() => showDeletePostConfirmDialog(post)}
						onLike={toggleLike}
					/>)
				}
			</div>
			<PostEditor
				open={isPostEditorOpen}
				handleClose={closeEditor}
				mode={postEditorState.mode}
				data={{
					id: postEditorState?.id,
					date: postEditorState?.date,
					userId: postEditorState?.userId,
					imageUrl: postEditorState?.imageUrl,
					content: postEditorState?.content,
					likesCounter: postEditorState?.likesCounter
				}}
				onEditPost={editPost}
				onCreatePost={createPost}
			/>
			<DeletePostDialog
				open={deletePostDialogState.isOpen}
				post={deletePostDialogState.post}
				onClose={closeDeleteDialog}
				onConfirm={deletePostDialogState.onConfirm}
			/>
		</DataContext.Provider>
	)
}

export default App
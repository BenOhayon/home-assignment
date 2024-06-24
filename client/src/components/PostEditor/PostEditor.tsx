import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import "./styles.css";
import TextArea from "../TextArea/TextArea";
import { PostEditorMode, UserData, PostEditorData, PostData } from "../../types";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { addPost, editPost } from "../../api/posts";
import BaseDialog from "../dialogs/BaseDialog/BaseDialog";

type PostEditorProps = {
	mode: PostEditorMode,
	open: boolean,
	data: PostData,
	handleClose?: () => void,
	onEditPost: (post: PostData) => void,
	onCreatePost: (post: PostData) => void
}

const PostEditor: React.FC<PostEditorProps> = ({
	mode,
	open,
	data,
	handleClose = () => { },
	onEditPost = () => { },
	onCreatePost = () => { }
}) => {

	const [postEditorFormData, setPostEditorFormData] = useState<PostEditorData>({
		imageUrl: "",
		content: ""
	})
	const [isAbleToSavePost, setIsAbleToSavePost] = useState(false)

	useEffect(() => {
		setIsAbleToSavePost(
			postEditorFormData.content !== ''
		)
	}, [postEditorFormData])

	useEffect(() => {
		setPostEditorFormData({
			imageUrl: data?.imageUrl,
			content: data?.content
		})
	}, [data])

	function handleFormDataChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		setPostEditorFormData((prev: PostEditorData) => ({
			...prev,
			[event.target.name]: event.target.value
		}))
	}

	function save(e: FormEvent) {
		e.preventDefault()
		console.log({data})
		const post = {
			id: data?.id,
			date: data?.date,
			userId: data?.userId,
			content: postEditorFormData.content, 
			imageUrl: postEditorFormData.imageUrl,
			likesCounter: data?.likesCounter
		}

		if (mode === PostEditorMode.CREATE) {
			addPost(data?.userId, postEditorFormData.content, postEditorFormData.imageUrl)
			onCreatePost(post)
		} else {
			editPost(post)
			onEditPost(post)
		}
		handleClose()
	}

	function closeDialog() {
		setPostEditorFormData({
			imageUrl: "",
			content: ""
		})
		handleClose()
	}

	return (
		<BaseDialog
			onClose={handleClose}
			open={open}
		>
			<DialogTitle>{mode === PostEditorMode.CREATE ? "Create a Post" : "Edit a Post"}</DialogTitle>
			<DialogContent className="post-editor-content">
				<TextField
					id="image-url"
					placeholder="Image Url"
					value={postEditorFormData.imageUrl}
					onChange={handleFormDataChange}
					name="imageUrl"
				/>
				<TextArea
					id="content"
					minRows={2}
					maxRows={3}
					placeholder="Content"
					value={postEditorFormData.content}
					onChange={handleFormDataChange}
					name="content"
				/>
				<DialogActions sx={{ padding: '8px 0 0 0' }}>
					<Button onClick={save} disabled={!isAbleToSavePost}>{mode === PostEditorMode.CREATE ? "Create" : "Submit"}</Button>
					<Button onClick={closeDialog}>Cancel</Button>
				</DialogActions>
			</DialogContent>
		</BaseDialog>
	)
}

export default PostEditor
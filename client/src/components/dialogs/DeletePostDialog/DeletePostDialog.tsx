import React from 'react'
import { BaseDialogProps } from '../BaseDialog/BaseDialog'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'
import { PostData } from '../../../types'
import { deletePost } from '../../../api/posts'

type DeletePostDialogProps = BaseDialogProps & {
    post: PostData | null,
    onConfirm: () => void
}

const DeletePostDialog: React.FC<DeletePostDialogProps> = ({
    open,
    post,
    onClose = () => { },
    onConfirm = () => { }
}) => {

    function onDeletePost() {
        if (post) {
            onClose()
            deletePost(post?.id)
            onConfirm()
        }
    }

    return (
        <ConfirmDialog 
            open={open} 
            onClose={onClose} 
            onConfirm={onDeletePost}
            title="Delete Post"
            content="Are you sure you want to delete this post?"          
        />
    )
}

export default DeletePostDialog
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import './PostItem.css'
import { UserAvatar } from '../UserAvatar'
import { PostData, UserData } from '../../types'
import EditIcon from '@mui/icons-material/Edit'
import { Badge, IconButton, Tooltip } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import DeleteIcon from '@mui/icons-material/Delete'
import { getLikedUsers, performLike } from '../../api/posts'
import { useDataContext } from '../../App'

type PostItemProps = {
    user: UserData,
    post: PostData,
    currentUserId: number,
    onEditPost: () => void,
    onDeletePost: () => void,
    onLike: (postId: number, userId: number) => void
}

const PostItem: React.FC<PostItemProps> = ({
    user,
    post,
    currentUserId,
    onEditPost = () => { },
    onDeletePost = () => { },
    onLike = () => { }
}) => {
    const {
        users
    } = useDataContext()

    const [formattedCreationDate, setFormattedCreationDate] = useState("")
    const [likedUsersTooltip, setLikedUsersTooltip] = useState("")

    // const likeButtonRef = useRef<HTMLElement>(null)

    // useEffect(() => {
    //     if (likeButtonRef?.current) {
    //         likeButtonRef.current.addEventListener('hover', 
    //     }
    // }, [])

    useEffect(() => {
        if (post) {
            setFormattedCreationDate(formatPostCreationDate())
        }
    }, [post])

    function formatPostCreationDate() {
        return new Intl.DateTimeFormat("en-US", {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        }).format(new Date(post?.date))
    }

    function like() {
        performLike(post?.id, currentUserId)
        onLike(post?.id, currentUserId)
    }

    function getLikedUsersTooltip(likedUsers: UserData[]): string {
        return likedUsers.reduce((result: string, user: UserData, index: number) => {
            result += user?.name
            if (index !== likedUsers.length - 1) {
                result += ", "
            }
            return result
        }, "")
    }

    function requestLikedUsers() {
        if (post?.likesCounter > 0) {
            getLikedUsers(post?.id)
                .then(likedUsers => setLikedUsersTooltip(getLikedUsersTooltip(likedUsers)))
                .catch(console.log)
        }
    }

    return (
        <div className='post-item-container'>
            <div className="post-item-body">
                <div className="post-item-author-container">
                    <UserAvatar user={user} />
                    <div className="post-item-author-details-container">
                        <div className="post-item-author-name">{user?.name}</div>
                        {formattedCreationDate && <div className="post-item-post-created-at">{formattedCreationDate}</div>}
                    </div>
                </div>
                {post?.imageUrl && <img className='post-item-image' src={post?.imageUrl} />}
                <p className="post-item-content">{post?.content}</p>
            </div>
            <div className="post-item-buttons-bar">
                <div className="post-item-buttons-bar-left-side">
                    {
                        currentUserId === user?.id && <>
                            <IconButton onClick={onEditPost}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={onDeletePost}>
                                <DeleteIcon />
                            </IconButton>
                        </>
                    }
                </div>
                <div className="post-item-buttons-bar-right-side">
                    <Tooltip title={likedUsersTooltip} onOpen={requestLikedUsers}>
                        <IconButton onClick={like}>
                            <Badge sx={{ fontSize: '12px' }} color='primary' badgeContent={post?.likesCounter}>
                                <ThumbUpIcon color={post?.likesCounter > 0 ? 'primary' : 'disabled'} fontSize='small' sx={{ padding: '2px 6px 2px 0' }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </div >
    )
}

export default PostItem
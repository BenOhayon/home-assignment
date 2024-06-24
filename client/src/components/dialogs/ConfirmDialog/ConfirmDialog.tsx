import React from 'react'
import BaseDialog, { BaseDialogProps } from '../BaseDialog/BaseDialog'
import { Button, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import './ConfirmDialog.css'

type ConfirmDialogProps = BaseDialogProps & {
    title: string,
    content: string,
    onConfirm: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    title,
    content,
    onClose = () => { },
    onConfirm = () => { }
}) => {
    return (
        <BaseDialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <p>{content}</p>
            </DialogContent>
            <DialogActions className='confirm-dialog-action-buttons'>
                <Button onClick={onConfirm}>Yes</Button>
                <Button onClick={onClose}>No</Button>
            </DialogActions>
        </BaseDialog>
    )
}

export default ConfirmDialog
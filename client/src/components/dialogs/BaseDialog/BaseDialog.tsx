import { Dialog } from '@mui/material'
import React, { ReactNode } from 'react'
import { DIALOG_TRANSITION_DURATION_MILLISECONDS } from '../../../constants/general.constants'

export type BaseDialogProps = {
    children?: ReactNode
    open: boolean,
    onClose: () => void
}

const BaseDialog: React.FC<BaseDialogProps>  = ({
    children,
    open,
    onClose = () => { }
}) => {
    return (
        <Dialog 
            open={open}
            onClose={onClose}
            transitionDuration={DIALOG_TRANSITION_DURATION_MILLISECONDS}
        >
            {children}
        </Dialog>
    )
}

export default BaseDialog
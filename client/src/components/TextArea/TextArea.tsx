import { TextField, TextFieldProps } from '@mui/material'

export default function TextArea(props: TextFieldProps) {
    return <TextField multiline={true} {...props} />
}
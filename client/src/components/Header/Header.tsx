import {
	AppBar,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material" 
import { AddOutlined } from "@mui/icons-material" 
import { UserData } from "../../types" 
import "./styles.css" 
import { UserAvatar } from "../UserAvatar" 
import { HEADER_HEIGHT_PX } from "../../constants/general.constants"

type HeaderProps = {
	openPostEditor: () => void
	user: UserData,
	onAvatarClick: () => void
} 

const Header: React.FC<HeaderProps> = ({ 
	user,
	openPostEditor = () => { },
	onAvatarClick = () => { }
}) => {

	return (
		<AppBar position="fixed" sx={{ height: `${HEADER_HEIGHT_PX}px` }}>
			<Toolbar disableGutters className="app-toolbar">
				<Tooltip title="Switch User">
					<IconButton onClick={onAvatarClick}>
						<UserAvatar user={user} className="user-avatar" />
					</IconButton>
				</Tooltip>
				<div>
					<Typography className="app-title main" variant="h6">
						BriefCam Social
					</Typography>
					<Typography className="app-title" variant="subtitle1" lineHeight={1}>
						{user?.name}
					</Typography>
				</div>
				<Tooltip title="Add Post">
					<IconButton onClick={openPostEditor}>
						<AddOutlined htmlColor="white" />
					</IconButton>
				</Tooltip>
			</Toolbar>
		</AppBar>
	) 
} 

export default Header
import { Avatar, AvatarProps } from "@mui/material";
import { UserData } from "../../types";
import { forwardRef } from "react";

type UserAvatarProps = AvatarProps & {
	user: UserData
}

export const UserAvatar = forwardRef<HTMLDivElement, UserAvatarProps>(
	({ user, ...props }, ref) => {
		return <Avatar alt={user?.name} src={user?.avatar} ref={ref} {...props}>
			{user?.avatar ? "" : user?.name.length > 0 ? user?.name[0] : ""}
		</Avatar>;
	}
);

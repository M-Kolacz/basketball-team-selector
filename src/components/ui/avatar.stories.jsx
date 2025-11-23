import { Avatar, AvatarImage, AvatarFallback } from '#app/components/ui/avatar';
var meta = {
    title: 'UI/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export var Default = {
    render: function () { return (<Avatar>
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>); },
};
export var WithFallback = {
    render: function () { return (<Avatar>
			<AvatarImage src="https://invalid-url.com/image.png" alt="@user"/>
			<AvatarFallback>JD</AvatarFallback>
		</Avatar>); },
};
export var FallbackOnly = {
    render: function () { return (<Avatar>
			<AvatarFallback>AB</AvatarFallback>
		</Avatar>); },
};
export var Multiple = {
    render: function () { return (<div className="flex items-center gap-3">
			<Avatar>
				<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
				<AvatarFallback>CN</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarImage src="https://invalid-url.com/image.png" alt="@user"/>
				<AvatarFallback>JD</AvatarFallback>
			</Avatar>
			<Avatar>
				<AvatarFallback>AB</AvatarFallback>
			</Avatar>
		</div>); },
};

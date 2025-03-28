import { useRef } from 'react';
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import LogoutBtn from "./logout-button";
import UsernameForm from "./username-form";
import PasswordForm from "./password-form";
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentUser, updateAvatar, updateCoverImage } from '@/features/user/UserSlice';
import { AppDispatch } from '@/app/store';
import ActionTooltip from '../ActionTooltip';

const UserButton = () => {
    const user = useSelector(selectCurrentUser);
    const dispatch = useDispatch<AppDispatch>()

    const avatarInputRef = useRef<HTMLInputElement | null>(null);
    const coverImageInputRef = useRef<HTMLInputElement | null>(null);

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const avatarFile = event.target.files[0];
            dispatch(updateAvatar({ avatar: avatarFile }))
        }
    };

    const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const coverImageFile = event.target.files[0];
            dispatch(updateCoverImage({ coverImage: coverImageFile }))
        }
    };

    return (
        <>
            <Dialog>
                <ActionTooltip side="right" align="end" label="User Button">
                    <DialogTrigger asChild>
                        <Avatar>
                            <AvatarImage
                                src={user?.avatar?.url ?? 'https://github.com/shadcn.png'}
                                alt="@shadcn"
                                className='cursor-pointer'
                            />
                        </Avatar>
                    </DialogTrigger>
                </ActionTooltip>
                <DialogContent className="sm:max-w-[525px]">
                    {/* Cover and Avatar with hover overlays */}
                    <div className="w-full h-36 relative">
                        {/* Cover Image */}
                        <div
                            className="w-full h-36 overflow-hidden relative group cursor-pointer"
                            onClick={() => coverImageInputRef.current?.click()}
                        >
                            <img
                                src={user?.coverImage?.url ?? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcXVpcnesw3j5p4_hflMMzyZSpbDfL5HwQQg&s'}
                                className="absolute rounded-xl inset-0 w-full h-full object-cover"
                                alt="Cover Image"
                            />
                            {/* pointer-events-none ensures the overlay does NOT block clicks */}
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                <span className="text-white">Change Cover</span>
                            </div>
                        </div>
                        
                        {/* Avatar Container */}
                        <div
                            className="absolute bottom-0 left-0 transform translate-y-1/2 w-24 h-24 cursor-pointer group"
                            style={{ width: '6rem', height: '6rem' }}
                            onClick={() => avatarInputRef.current?.click()}
                        >
                            <div className="relative w-full h-full">
                                <img
                                    src={user?.avatar?.url ?? 'https://github.com/shadcn.png'}
                                    className="w-full h-full object-cover rounded-full"
                                    alt="Avatar"
                                />
                                <div className="absolute inset-0 bg-black/50 rounded-full flex justify-center items-center opacity-0 group-hover:opacity-100 transition pointer-events-none">
                                    <span className="text-white text-sm">Change Avatar</span>
                                </div>
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={avatarInputRef}
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                            accept="image/*"
                        />
                        <input
                            type="file"
                            ref={coverImageInputRef}
                            style={{ display: 'none' }}
                            onChange={handleCoverImageChange}
                            accept="image/*"
                        />
                    </div>

                    <DialogHeader className="mt-10">
                        <DialogTitle>{user?.username ?? 'Jovial Kanwadia'}</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here.
                        </DialogDescription>
                    </DialogHeader>

                    {/* User Name Form Component */}
                    <UsernameForm username={user?.username ?? 'Jovial Kanwadia'} />

                    <div className="border border-slate-800"></div>
                    <div className="grid gap-4 py-2">
                        <PasswordForm />
                        <DialogFooter>
                            <LogoutBtn />
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserButton;

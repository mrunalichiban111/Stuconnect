import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers, Member, selectMembers } from "@/features/member/MembersSlice";
import { useEffect, useState } from "react";
import { changeRoleToGuest, changeRoleToModerator, getProfilesByServerId, kickOutMember } from "@/app/apiCalls";
import { useNavigate, useParams } from "react-router-dom";
import { Profile, selectUserProfile } from "@/features/profile/ProfileSlice";
import { MoreVertical, ShieldCheck, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DropdownMenuCheckboxItem } from "@radix-ui/react-dropdown-menu";
import { AppDispatch } from "@/app/store";

type Role = 'GUEST' | 'MODERATOR' | 'ADMIN';

const roleIconMap: Record<Role, JSX.Element | null> = {
    GUEST: <ShieldCheck className="h-4 w-4 ml-2 text-green-700" />,
    MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-blue-700" />,
    ADMIN: <ShieldCheck className="h-4 w-4 ml-2 text-red-500" />
};

const ManageMembersItem = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const members = useSelector(selectMembers);
    const profile = useSelector(selectUserProfile);
    const params = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()


    const admin: Member | undefined = members.find((member: Member) => member.role === 'ADMIN');
    const moderators: Member[] = members.filter((member: Member) => member.role === 'MODERATOR');
    const guests: Member[] = members.filter((member: Member) => member.role === 'GUEST');

    const currentUserRole: Role = (() => {
        if (profile) {
            if (admin?.profileId === profile._id) return 'ADMIN';
            if (moderators.some((moderator) => moderator.profileId === profile._id)) return 'MODERATOR';
            if (guests.some((guest) => guest.profileId === profile._id)) return 'GUEST';
        }
        return 'GUEST'; // Default to GUEST if no role matches
    })();

    useEffect(() => {
        const handleGetProfiles = async () => {
            if (params?.id) {
                const result = await getProfilesByServerId(params.id);
                setProfiles(result);
            }
        };
        handleGetProfiles();
    }, [params?.id]);

    const changeRoleToGuestFunction = async (memberId: string) => {
        await changeRoleToGuest(memberId);
        if (params.id) {
            dispatch(fetchMembers({ serverId: params.id }));
        }
    };

    const changeRoleToModeratorFunction = async (memberId: string) => {
        await changeRoleToModerator(memberId);
        if (params.id) {
            dispatch(fetchMembers({ serverId: params.id }));
        }
    };

    const kickOutMemberFunction = async (memberId: string, profileId: string) => {
        if (params.id) {
            await kickOutMember(memberId, profileId, params.id);
            dispatch(fetchMembers({ serverId: params.id }));
        }
    };

    const redirectToMemberIdPage = (memberId: string) => {
        navigate(`/servers/${params.id}/members/${memberId}`)
    }

    const renderProfile = (profileId: string, role: Role, memberId: string) => {
        const profile = profiles.find((profile) => profile._id === profileId);
        
        if (profile) {
            return (
                <CommandItem key={profile._id} onSelect={() => {redirectToMemberIdPage(memberId)}} className="flex hover:bg-[#1E1F22] items-center justify-between p-2">
                    <div className="flex items-center">
                        <Avatar className="h-7 w-7 md:h-10 md:w-10">
                            <AvatarImage src={profile.imageUrl ?? undefined} />
                        </Avatar>
                        <div className="flex flex-col gap-y-1 ml-3">
                            <div className="text-sm text-black dark:text-white font-semibold flex items-center">
                                {profile.username}
                                {roleIconMap[role]}
                            </div>
                        </div>
                    </div>
                    <CommandShortcut className="text-white/60">
                        {currentUserRole === 'ADMIN' && role !== 'ADMIN' && (
                            <div className="mr-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreVertical className="h-4 w-4 text-white" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent side="left">
                                        <DropdownMenuCheckboxItem
                                            onClick={() => { changeRoleToGuestFunction(memberId) }}
                                            className={`flex cursor-pointer rounded-sm p-1 ${role === 'GUEST' ? 'bg-yellow-700' : 'bg-transparent'}`}>
                                            <p className="text-xm font-semibold">Guest</p>
                                            <ShieldCheck className="h-4 w-4 mt-1 ml-2 text-green-500" />
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem
                                            onClick={() => { changeRoleToModeratorFunction(memberId) }}
                                            className={`flex cursor-pointer p-1 rounded-sm ${role === 'MODERATOR' ? 'bg-yellow-700' : 'bg-transparent'}`}>
                                            <p className="text-xm font-semibold">Moderator</p>
                                            <ShieldCheck className="h-4 w-4 mt-1 ml-2 text-indigo-500" />
                                        </DropdownMenuCheckboxItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuCheckboxItem
                                            onClick={() => { kickOutMemberFunction(memberId, profile._id) }}
                                            className="flex cursor-pointer p-1">
                                            <p className="text-xm font-semibold">Kick </p>
                                            <Trash className="h-4 w-4 ml-2 mt-1 text-red-500" />
                                        </DropdownMenuCheckboxItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </CommandShortcut>
                </CommandItem>
            );
        }
        return null;
    };

    return (
        <Command className="rounded-lg h-screen dark:bg-[#2B2D31] border-none text-white">
            <CommandInput
                placeholder="Search a member..."
                className="placeholder:text-white/60"
            />
            <CommandList className="border-none">
                <CommandEmpty className="text-white">No results found.</CommandEmpty>
                <CommandGroup heading="Admin" className="text-white">  
                    {admin && renderProfile(admin.profileId, "ADMIN", admin._id)}
                </CommandGroup>  

                {admin && ((moderators.length > 0 || guests.length > 0)) && (<CommandSeparator className="bg-white/20 my-2" />)}
                
                {/* If you want to not show 'moderator' text when no moderators are present, you can uncomment the code below and comment the one below the uncommented. */}
                {/* {moderators.length > 0 && (
                    <CommandGroup heading="Moderators" className="text-white">
                        {moderators.map((moderator) => renderProfile(moderator.profileId, "MODERATOR", moderator._id))}
                    </CommandGroup>
                )} */}
                <CommandGroup heading="Moderators" className="text-white">
                    {moderators.map((moderator) => renderProfile(moderator.profileId, "MODERATOR", moderator._id))}
                </CommandGroup>
                {moderators.length > 0 && guests.length > 0 && <CommandSeparator className="bg-white/20 my-2" />}

                {/* If you want to not show 'guests' text when no guests are present, you can uncomment the code below and comment the one below the uncommented. */}
                {/* {guests.length > 0 && (
                    <CommandGroup heading="Guests" className="text-white">
                        {guests.map((guest) => renderProfile(guest.profileId, "GUEST", guest._id))}
                    </CommandGroup>
                )} */}
                
                
                <CommandGroup heading="Guests" className="text-white">
                    {guests.map((guest) => renderProfile(guest.profileId, "GUEST", guest._id))}
                </CommandGroup>
                
            </CommandList>
        </Command>
    );
}

export default ManageMembersItem;

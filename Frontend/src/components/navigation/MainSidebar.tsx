import { Plus } from "lucide-react";
import ActionTooltip from "@/components/ActionTooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile } from "@/features/profile/ProfileSlice";
import { useEffect, useState } from "react";
import { fetchServers, selectServers, Server } from "@/features/server/ServerSlice";
import { AppDispatch } from "@/app/store";
import NavigationItem from "@/components/navigation/NavigationItem";
import { ModeToggle } from "@/components/theme/mode-toggle";
import UserButton from "@/components/auth/user-button";
import AddServerModal from "@/components/modals/AddServerModal"; // Correct import path
import { fetchMembers } from "@/features/member/MembersSlice";
import { useNavigate, useParams } from "react-router-dom";
import { fetchChannels } from "@/features/channel/ChannelsSlice";
import { Avatar, AvatarImage } from "@/components/ui/avatar";



const MainSidebar = () => {
    const profile = useSelector(selectUserProfile);
    const dispatch = useDispatch<AppDispatch>();
    const servers: Server[] = useSelector(selectServers);
    const [isOpen, setIsOpen] = useState(false);
    const params = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        if (params.id) {
            dispatch(fetchMembers({ serverId: params.id }));
            dispatch(fetchChannels({ serverId: params.id }));
        }
    }, [dispatch, params.id]);


    useEffect(() => {
        if (profile) {
            dispatch(fetchServers({ profileId: profile._id }));
        }
    }, [dispatch, profile]);

    const toggleModal = () => {
        setIsOpen(prev => !prev);
    };


    return (
        <div className="space-y-4 flex flex-col items-center h-full w-full text-primary bg-slate-300 dark:bg-[#1E1F22] py-3">
            <ActionTooltip side="right" align="end" label="Add a server">
                <button className="group flex items-center" onClick={toggleModal}>
                    <div className="flex mx-3 w-12 h-12 rounded-full transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
                        <Plus className="text-emerald-500 group-hover:text-white transition" />
                    </div>
                </button>
            </ActionTooltip>
            <Separator className="h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <ScrollArea className="flex-1 w-full">
                {servers.length > 0 && servers.map((server) => (
                    <div key={server._id} className="mb-3">
                        <NavigationItem
                            id={server._id}
                            image={server.serverImage.url}
                            name={server.name}
                        />
                    </div>
                ))}
            </ScrollArea>
            <Separator className="h-[1px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            <div className="pb-3 mt-auto flex flex-col items-center gap-y-4">
                <ModeToggle />
                <UserButton />
                <div>
                    <ActionTooltip side="right" align="end" label="Docs">
                        <Avatar onClick={() => window.open('https://na-e282180f.mintlify.app/', '_blank')}>
                            <AvatarImage src='https://cdn3d.iconscout.com/3d/premium/thumb/document-10789279-8747400.png' alt="@shadcn" className='cursor-pointer' />
                        </Avatar>
                    </ActionTooltip>
                </div>
                <div>
                    <ActionTooltip side="right" align="end" label="OpenAI">
                        <Avatar onClick={() => {navigate(`/openai/file`)}}>
                            <AvatarImage src='https://static.vecteezy.com/system/resources/previews/022/841/114/original/chatgpt-logo-transparent-background-free-png.png' alt="@shadcn" className='cursor-pointer' />
                        </Avatar>
                    </ActionTooltip>
                </div>
            </div>
            <AddServerModal isOpen={isOpen} onClose={toggleModal} />
        </div>
    );
};

export default MainSidebar;

// https://i.pinimg.com/736x/33/d5/cb/33d5cbb35f83f09537b33fe52b51ba30.jpg
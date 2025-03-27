import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { deleteChannel } from "@/app/apiCalls";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/app/store";
import { fetchChannels } from "@/features/channel/ChannelsSlice";
import { fetchServers } from "@/features/server/ServerSlice";
import { useNavigate } from "react-router-dom";
import { selectUserProfile } from "@/features/profile/ProfileSlice";

interface DeleteChannelModalProps {
    channelId: string,
    serverId: string,
    channelName: string,
}

const DeleteChannelModal = ({ channelId, serverId, channelName }: DeleteChannelModalProps) => {
    const navigate = useNavigate()
    const profile = useSelector(selectUserProfile)
    const dispatch  = useDispatch<AppDispatch>()
    const [isOpen, setIsOpen] = useState(false); 
    
    const handleDeleteChannel = async () => {
        try {
            await deleteChannel(channelId, serverId)
            dispatch(fetchChannels({ serverId: serverId }));
            dispatch(fetchServers({ profileId: profile._id }));
            navigate(`/servers/${serverId}`)
            setIsOpen(false)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Trash className="ml-auto h-4 w-4 hover:text-red-500"/>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-black text-black dark:text-white p-0 overflow-hidden">
                <DialogHeader className='pt-8 px-6'>
                    <DialogTitle className="text-2xl mt-6 text-center font-bold">
                        Leave Server
                    </DialogTitle>
                    <DialogDescription className="text-center text-xl dark:text-white text-zinc-500">
                        Are you sure you want to delete <span className="text-blue-400">{channelName}</span> channel?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 dark:bg-gray-900 px-6 mt-6 py-4">
                    <div className="flex items-center justify-end w-full">
                        <Button variant="primary" onClick={handleDeleteChannel}>
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteChannelModal;

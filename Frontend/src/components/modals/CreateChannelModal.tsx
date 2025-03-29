import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { createChannelSchema } from "@/schema";
import { useDispatch, useSelector } from 'react-redux';
import { selectUserProfile } from '@/features/profile/ProfileSlice';
import { createChannel } from "@/app/apiCalls";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from "react-router-dom";
import { fetchChannels } from "@/features/channel/ChannelsSlice";
import { AppDispatch } from "@/app/store";
import { fetchServers } from "@/features/server/ServerSlice";
import { useState } from "react"; // Import useState

const CreateChannelModal = () => {
    const params = useParams<{ id: string }>();
    const profile = useSelector(selectUserProfile);
    const dispatch = useDispatch<AppDispatch>();
    const [isOpen, setIsOpen] = useState(false); // State for managing dialog open/close

    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(createChannelSchema),
        defaultValues: {
            channelName: "",
            channelType: "TEXT"
        },
    });

    const onSubmitCreate = async (values: z.infer<typeof createChannelSchema>) => {
        if (profile?._id) {
            try {
                if (params.id) {
                    const serverId: string = params.id;
                    await createChannel(values.channelName, values.channelType, profile._id, serverId);
                    dispatch(fetchChannels({ serverId: params.id }));
                    dispatch(fetchServers({ profileId: profile._id }));
                    setIsOpen(false);
                }
            } catch (error) {
                console.error("Error creating channel:", error);
            }
        } else {
            console.error("Profile ID is missing");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div className="w-56 mb-2 bg-white hover:bg-zinc-300 transition h-9 dark:bg-[#1E1F22] flex items-center justify-center rounded-none">Create Channel</div>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-black text-black dark:text-white p-0 overflow-hidden">
                <DialogTitle className="text-2xl mt-6 text-center font-bold">
                    Create a Channel
                </DialogTitle>
                <DialogDescription className="text-center text-zinc-500 dark:text-white px-4">
                    Enter details to create a new channel.
                </DialogDescription>
                <form onSubmit={handleSubmit(onSubmitCreate)}>
                    <div className="space-y-8 px-6 py-3">
                        <div>
                            <label className="text-xs uppercase font-bold text-zinc-500 dark:text-white">
                                Channel Name
                            </label>
                            <Input
                                className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
                                placeholder="Enter channel name"
                                {...register('channelName')}
                            />
                            {errors.channelName && <span>{errors.channelName.message}</span>}
                        </div>
                        <div>
                            <label className="text-xs uppercase font-bold text-zinc-500 dark:text-white">
                                Channel Type
                            </label>
                            <Select
                                value={watch("channelType")}
                                onValueChange={(value) => setValue("channelType", value)}
                            >
                                <SelectTrigger className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0">
                                    <SelectValue placeholder="Select a channel type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TEXT">Text</SelectItem>
                                    <SelectItem value="AUDIO">Audio</SelectItem>
                                    <SelectItem value="VIDEO">Video</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.channelType && <span>{errors.channelType.message}</span>}
                        </div>
                    </div>
                    <DialogFooter className="bg-gray-100 dark:bg-black px-6 py-4">
                        <Button type="submit" variant="primary">
                            Create
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default CreateChannelModal;

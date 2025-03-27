import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { createServerSchema, joinServerSchema } from "@/schema";
import UploadFile from "@/components/UploadFile";
import { useDispatch, useSelector } from 'react-redux';
import { selectFile } from '@/features/Upload/UploadSlice';
import { createServer, joinServer } from '@/app/apiCalls';
import { fetchProfile, selectUserProfile } from '@/features/profile/ProfileSlice';
import { displayError } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '@/app/store';

interface ServerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AddServerModal = ({ isOpen, onClose }: ServerModalProps) => {
    const [activeForm, setActiveForm] = useState<'create' | 'join'>('create');
    const file = useSelector(selectFile);
    const profile = useSelector(selectUserProfile);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate()

    const { register: registerCreate, handleSubmit: handleSubmitCreate, formState: { errors: createErrors } } = useForm({
        resolver: zodResolver(createServerSchema),
        defaultValues: {
            name: "",
        },
    });

    const { register: registerJoin, handleSubmit: handleSubmitJoin, formState: { errors: joinErrors } } = useForm({
        resolver: zodResolver(joinServerSchema),
        defaultValues: {
            inviteCode: "",
        },
    });

    const onSubmitCreate = async (values: z.infer<typeof createServerSchema>) => {
        if (file && profile?._id) {
            try {
                onClose(); // Close the modal after successful submission
                const response = await createServer(values.name, file, profile._id);
                dispatch(fetchProfile());
                navigate(`/servers/${response.data._id}`)
            } catch (error) {
                displayError("Error creating server");
                console.error("Error creating server:", error);
            }
        } else {
            console.error("File or profile ID is missing");
        }
    };

    const onSubmitJoin = async (values: z.infer<typeof joinServerSchema>) => {
        if (profile?._id) {
            try {
                onClose(); // Close the modal after successful submission
                const id = await joinServer(values.inviteCode, profile._id);
                dispatch(fetchProfile());
                navigate(`/servers/${id}`)
            } catch (error) {
                displayError("Error joining server");
                console.error("Error joining server:", error);
            }
        } else {
            console.error("Profile ID is missing");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white dark:bg-black text-black dark:text-white p-0 overflow-hidden">
                {activeForm === 'create' ? (
                    <>
                        <DialogTitle className="text-2xl mt-6 text-center font-bold">
                            Customize your server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 dark:text-white px-4">
                            Give your server a personality with a name and image. You can always change it later.
                        </DialogDescription>
                        <form onSubmit={handleSubmitCreate(onSubmitCreate)}>
                            <div className="space-y-8 px-6 py-3">
                                <div className="flex items-center justify-center text-center">
                                    <UploadFile buttonType="dnd" />
                                </div>
                                <div>
                                    <label className="text-xs uppercase font-bold text-zinc-500 dark:text-white">
                                        Server name
                                    </label>
                                    <Input
                                        className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
                                        placeholder="Enter server name"
                                        {...registerCreate('name')}
                                    />
                                    {createErrors.name && <span>{createErrors.name.message}</span>}
                                </div>
                            </div>
                            <DialogFooter className="bg-gray-100 dark:bg-black px-6 py-4">
                                <Button type="submit" variant="primary">
                                    Create
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                ) : (
                    <>
                        <DialogTitle className="text-2xl mt-6 text-center font-bold">
                            Join a server
                        </DialogTitle>
                        <DialogDescription className="text-center text-zinc-500 dark:text-white px-4">
                            Enter the invite code to join an existing server.
                        </DialogDescription>
                        <form onSubmit={handleSubmitJoin(onSubmitJoin)}>
                            <div className="space-y-8 px-6 py-3">
                                <div>
                                    <label className="text-xs uppercase font-bold text-zinc-500 dark:text-white">
                                        Invite Code
                                    </label>
                                    <Input
                                        className="bg-zinc-300/50 dark:bg-zinc-700 border-0 focus-visible:ring-0 text-white focus-visible:ring-offset-0"
                                        placeholder="Enter invite code"
                                        {...registerJoin('inviteCode')}
                                    />
                                    {joinErrors.inviteCode && <span>{joinErrors.inviteCode.message}</span>}
                                </div>
                            </div>
                            <DialogFooter className="bg-gray-100 dark:bg-black px-6 py-4">
                                <Button type="submit" variant="primary">
                                    Join
                                </Button>
                            </DialogFooter>
                        </form>
                    </>
                )}
                <DialogFooter className="bg-gray-100 dark:bg-black px-6 py-4 grid grid-cols-2">
                    <div
                        className={`cursor-pointer justify-center items-center rounded-lg flex px-4 py-2 ${activeForm === 'create' ? 'bg-blue-600 text-white' : 'bg-zinc-500 hover:bg-zinc-600'}`}
                        onClick={() => setActiveForm('create')}
                    >
                        Create Server
                    </div>
                    <div
                        className={`cursor-pointer justify-center items-center rounded-lg flex px-4 py-2 ${activeForm === 'join' ? 'bg-blue-600 text-white' : 'bg-zinc-500 hover:bg-zinc-600'}`}
                        onClick={() => setActiveForm('join')}
                    >
                        Join Server
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddServerModal;

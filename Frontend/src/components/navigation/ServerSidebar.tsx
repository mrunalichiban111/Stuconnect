import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { selectServers, Server } from "@/features/server/ServerSlice";
import { Button } from "@/components/ui/button";
import ServerChannels from "@/components/navigation/ServerChannels";

const ServerSidebar = () => {
    const { id } = useParams<{ id: string }>();
    const servers = useSelector(selectServers);

    const [server, setServer] = useState<Server | undefined>();
    useEffect(() => {
        const selectedServer = servers.find((server: Server) => server._id === id);
        setServer(selectedServer);
    }, [id, servers]);

    if (!server) {
        return null;
    }

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <Button className="w-[90%] mx-auto flex items-center justify-center text-md font-semibold px-3 h-14 mt-1 border-b-2 border-neutral-200 bg-white text-zinc-800 dark:border-neutral-800 dark:bg-zinc-700/50 dark:text-white dark:hover:bg-zinc-700 hover:bg-zinc-700/10 transition rounded-none">
                {server.name}
            </Button>




            <div className="m-2">
                <ServerChannels />
            </div>
        </div>
    );
}

export default ServerSidebar;

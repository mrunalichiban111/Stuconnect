import { Hash, Mic, Video } from "lucide-react"
import { Avatar, AvatarImage } from "../ui/avatar"

interface ChatHeaderProps{
    serverId?: string,
    name: string,
    imageUrl: string,
    type: "channel" | "conversation",
    channelType?: string,
}

const ChatHeader = ({
    name,
    imageUrl,
    type,
    channelType
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
      {type === 'channel' && channelType === 'TEXT' && (
        <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
      )}
      {type === 'channel' && channelType === 'AUDIO' && (
        <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
      )}
      {type === 'channel' && channelType === 'VIDEO' && (
        <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
      )}
      {type === "conversation" && (
        <Avatar className="w-9 h-9 mr-2">
          <AvatarImage src={imageUrl}/>
        </Avatar>
      )}
      <p className="font-semibold text-md text-black dark:text-white">
        {name}
      </p>
    </div>
  )
}

export default ChatHeader

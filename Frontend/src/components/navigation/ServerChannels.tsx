import {
  Hash,
  Mic,
  Video,
} from "lucide-react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Channel, selectChannels } from "@/features/channel/ChannelsSlice"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import CreateChannelModal from "@/components/modals/CreateChannelModal"
import { Member, selectMembers } from "@/features/member/MembersSlice"
import { Profile, selectUserProfile } from "@/features/profile/ProfileSlice"
import DeleteChannelModal from "@/components/modals/DeleteChannelModal"
import { createLivekitVideoToken } from "@/app/apiCalls"

const ServerChannels = () => {
  const params = useParams()
  const navigate = useNavigate()
  const channels: Channel[] = useSelector(selectChannels)
  const members: Member[] = useSelector(selectMembers)
  const profile: Profile = useSelector(selectUserProfile) 

  const textChannels = channels.filter((channel) => channel.type === 'TEXT')
  const audioChannels = channels.filter((channel) => channel.type === 'AUDIO')
  const videoChannels = channels.filter((channel) => channel.type === 'VIDEO')

  const currentUserMember = members.find((member) => member.profileId === profile._id)
  const currentUserRole = currentUserMember?.role

  const handleTextChannelClick = (channelId: string, ) => {
    navigate(`/servers/${params.id}/channels/${channelId}`)
  }
  const handleVideoChannelClick = async(channelName: string, name: string) => {
    const response = await createLivekitVideoToken(channelName, name)
    navigate(`/video/${response.token}`)
  }
  const handleAudioChannelClick = async(channelName: string, name: string) => {
    const response = await createLivekitVideoToken(channelName, name)
    navigate(`/audio/${response.token}`)
  }

  return (
    <>
      {currentUserRole === 'ADMIN' && (<CreateChannelModal />)}
      <Command className="rounded-lg h-screen dark:bg-[#2B2D31] border-none text-white">
        <CommandInput placeholder="Search channel ..." />
        <CommandList>
          <CommandEmpty>No channels found.</CommandEmpty>
          <CommandGroup heading="Text Channels">
            {textChannels.map((channel) => (
              <CommandItem
                key={channel._id}
                onSelect={() => { handleTextChannelClick(channel._id) }}
                className={cn(params.channelId === channel._id ? `dark:bg-[#1E1F22]` : ``, `hover:bg-zinc-300`)}
              >
                <Hash className="mr-2 h-4 w-4"/>
                <span>{channel.name}</span>
                {currentUserRole === 'ADMIN'&& channel.name !== 'general' && params.id && (
                  <DeleteChannelModal serverId={params.id} channelId={channel._id} channelName={channel.name}/>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
          {audioChannels.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Voice Channels">
                {audioChannels.map((channel) => (
                  <CommandItem
                    key={channel._id}
                    onSelect={() => { handleAudioChannelClick(channel.name, profile.username) }}
                    className={cn(params.channelId === channel._id ? `bg-[#1E1F22]` : ``, `hover:bg-zinc-700`)}
                  >
                    <Mic className="mr-2 h-4 w-4" />
                    <span>{channel.name}</span>
                    {currentUserRole === 'ADMIN' && params.id && (
                      <DeleteChannelModal serverId={params.id} channelId={channel._id} channelName={channel.name}/>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
          {videoChannels.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup heading="Video Channels">
                {videoChannels.map((channel) => (
                  <CommandItem
                    key={channel._id}
                    onSelect={() => { handleVideoChannelClick(channel.name, profile.username) }}
                    className={cn(params.channelId === channel._id ? `bg-[#1E1F22]` : ``, `hover:bg-zinc-700`)}
                  >
                    <Video className="mr-2 h-4 w-4" />
                    <span>{channel.name}</span>
                    {currentUserRole === 'ADMIN' && params.id && (
                      <DeleteChannelModal serverId={params.id} channelId={channel._id} channelName={channel.name}/>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </Command>
    </>
  )
}

export default ServerChannels

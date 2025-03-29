import { Users } from "lucide-react"
import { useEffect, useState } from "react";
import ManageMembers from "@/components/navigation/ManageMembers";
import { useSelector } from "react-redux";
import { selectUserProfile } from "@/features/profile/ProfileSlice";
import { Member, selectMembers } from "@/features/member/MembersSlice";
import { useParams } from "react-router-dom";
import { selectServers, Server } from "@/features/server/ServerSlice";
import InvitePeopleModal from "../modals/InvitePeopleModal";
import LeaveServerModal from "../modals/LeaveServerModal";

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleModal = () => {
    setIsOpen(prev => !prev);
  };
;
  const members: Member[] = useSelector(selectMembers);
  const profile = useSelector(selectUserProfile);
  const { id } = useParams<{ id: string }>();
  const servers = useSelector(selectServers);
  const [server, setServer] = useState<Server | undefined>();

  const member = members.find((member) => member.profileId === profile?._id);
  const role = member?.role;

  const isAdmin = role === 'ADMIN';
  const isModerator = isAdmin || role === 'MODERATOR';
  useEffect(() => {
    const selectedServer = servers.find((server: Server) => server._id === id);
    setServer(selectedServer);
  }, [id, servers]);

  if (!server) {
    return null;
  }

  return (
    <div className="w-full h-full dark:bg-[rgb(30_31_34/1)] bg-[rgb(203_213_225/1)] flex items-center">

      <button onClick={toggleModal} className='w-auto hover:bg-gray-200 dark:hover:bg-zinc-700 flex text-md px-3 items-center h-10 border-neutral-200 rounded-md mx-1  transition'>
        Members
        <Users className="w-4 h-4 m-1 rounded-sm" />
      </button>
      <ManageMembers isOpen={isOpen} onClose={toggleModal} />

      {isModerator && (
        <InvitePeopleModal inviteCode={server.inviteCode}/>
      )}
      {isAdmin && (
        <div className="mx-2">Server Settings</div>
      )}
      {!isAdmin && (
        <LeaveServerModal/>
      )}
      {isAdmin && (
        <div className="mx-2">Delete Server</div>
      )}
    </div>
  )
}

export default Topbar

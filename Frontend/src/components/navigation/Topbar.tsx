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
import DeleteServerModal from "../modals/DeleteServerModal";

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
    <div className="w-full h-full bg-background flex items-center">

      <button onClick={toggleModal} className='w-auto hover:text-blue-400 flex text-md px-3 items-center h-10 border-neutral-200 rounded-md mx-1 dark:border-neutral-800 border-2 dark:bg-zinc-700/50 transition'>
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
        <DeleteServerModal/>
      )}
    </div>
  )
}

export default Topbar

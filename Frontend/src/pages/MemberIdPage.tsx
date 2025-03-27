import { getProfileById } from "@/app/apiCalls"
import ChatHeader from "@/components/chat/ChatHeader"
import { Member, selectMembers } from "@/features/member/MembersSlice"
import { Profile, selectUserProfile } from "@/features/profile/ProfileSlice"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

const MemberIdPage = () => {
  const params = useParams()
  const [targetUserProfile, setTargetUserProfile] = useState<Profile>()
  const currentUserProfile: Profile = useSelector(selectUserProfile)
  const members: Member[] = useSelector(selectMembers)
  const currentMember = members.find((member) => member.profileId === currentUserProfile._id)
  const targetMember = members.find((member) => member._id === params?.memberId)

  useEffect(() => {
    const fetchData = async () => {
      if (currentMember && targetMember) {
        const profile = await getProfileById(targetMember.profileId)
        setTargetUserProfile(profile)
      }
    }
    fetchData()
  }, [currentMember, targetMember])
  
  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-screen">
      {targetUserProfile && targetUserProfile.imageUrl && (<ChatHeader serverId={params?.id} name={targetUserProfile?.username} imageUrl={targetUserProfile?.imageUrl} type="conversation" />)}
    </div>
  )
}

export default MemberIdPage

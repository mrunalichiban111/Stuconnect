import Topbar from "@/components/navigation/Topbar"
import { selectServers, Server } from "@/features/server/ServerSlice"
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { Outlet, useNavigate, useParams } from "react-router-dom"


const ServerIdPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const servers: Server[] = useSelector(selectServers)
  const server = servers.find((server) => server._id === params.id)
  useEffect(() => {
    navigate(`/servers/${params.id}/channels/${server?.channels[0]}`)
  }, [params.id, server])
  
  return (
    <div>
      <div className='h-11 rounded-sm w-full z-20'>
          <Topbar/>
      </div>
      <div className="h-screen w-full">
        <Outlet/>
      </div>  
    </div>
  )
}

export default ServerIdPage

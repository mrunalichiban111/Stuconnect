import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { fetchProfile, selectUserProfile } from "@/features/profile/ProfileSlice";
import { AppDispatch } from '@/app/store';
import MainSidebar from '@/components/navigation/MainSidebar';
import ServerSidebar from '@/components/navigation/ServerSidebar';

const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector(selectUserProfile);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.servers && profile.servers.length > 0) {
      navigate(`/servers/${profile.servers[0]}`);
    }
  }, [profile, navigate]);
  
  return (
    <div className='flex h-full'>
      <div className='hidden z-40 md:flex h-full w-16 flex-col fixed'>
        <MainSidebar />
      </div>
      <div className='hidden z-20 md:flex h-full w-60 flex-col fixed left-16'>
        <ServerSidebar/>
      </div>
      <main className='hidden z-0 md:flex h-full w-full flex-col fixed left-[305px]'>
        <Outlet/>
      </main>
    </div>
  );
};

export default MainLayout;

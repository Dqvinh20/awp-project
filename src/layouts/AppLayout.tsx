import useAuth from '@/hooks/useAuth';
import Header from '@/pages/LandingPage/Header';
import userService from '@/services/userService';
import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function AppLayout() {
  // TODO: Replace this with your own authentication logic.
  const isAuthenticated = true;
  const {user_id,hasToken} = useAuth()
  const [avatar,setAvatart] = useState("")
  const [fullname,setFullname] = useState("")
  useEffect(()=>{
    const getDataUser = async ()=>{
      const {avatar,full_name} =await userService.getUser(user_id).then((res)=>{
        return res.data
      })
      console.log("Call get user")
      setAvatart(avatar)
      setFullname(full_name)
    }
    getDataUser();
  },[])
  const renderBody = () => (
    <>
      <div className="twp max-w-full text-base">
        <Header avatar={avatar} fullname={fullname}/>
      </div>
      <div className='h-screen d-flex justify-content-center align-content-center'>
        <div className='w-50' style={{paddingTop: "5rem"}}>
          <Outlet />
        </div>
      </div>
    </>
  );

  return hasToken ? renderBody() : <Navigate to="/sign-in" />;
}

export default AppLayout;

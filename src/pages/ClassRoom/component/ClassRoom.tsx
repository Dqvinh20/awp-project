import React from 'react'
import BannerClass from './BannerClass'
import { Navigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import useGetDetailClass from '@/hooks/useGetDetailClass';

export default function ClassRoom() {
  const { isLoading ,data, isError, error}  = useGetDetailClass();

  if(isLoading) return <h1>Loading...</h1>
  if(isError) return <div>Error + {error.message}</div>;
  return (
    <div className='h-full text-center flex flex-col justify-start'>
      <div className="flex justify-center items-center w-full h-fit mt-2">
        <BannerClass title={data.name}/>

      </div>
      <div className="">
        {data.description} 
      </div>
      <div className="">
        {data.code} 
      </div>
    </div>
  )
}

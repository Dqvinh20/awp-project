import React from 'react'
import BannerClass from './BannerClass'
import { useParams } from 'react-router-dom'

export default function ClassRoom() {
  const {id} = useParams();
  
  return (
    <div className='h-full text-center flex flex-col justify-start'>
      <div className="flex justify-center items-center w-full h-fit mt-2">
        <BannerClass title='Vinh'/>

      </div>
      <div className="">
        Hello 
      </div>
    </div>
  )
}

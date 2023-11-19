import React from 'react'

export default function JoinClass() {
  return (
    <div className='flex justify-center align-middle h-full w-full'>
      <div className="rounded w-3/5 h-fit border-solid border-2 border-gray-300 overflow-hidden" >
        <div className="bg-slate-100 p-8 flex flex-col justify-center align-middle">
          <div className='flex justify-center align-middle'>
            <img src="https://www.gstatic.com/classroom/logo_square_rounded.svg" className="w-25" alt="Google Classroom" data-iml="28027"/>
          </div>
          <div className="flex justify-center align-middle text-center gap-x-1.5">
            <strong className='text-lg'>AWP </strong><span className='text-end text-lg'>Classroom</span>
          </div>
          <div className="text-center text-xs" >
            <p className="tLDEHd RInnx u9RzIb">Classroom helps classes communicate, save time, and stay organized.
            <a className="etFl5b" target="_blank" href="https://support.google.com/edu/classroom/answer/6020279?hl=en&amp;authuser=0">Learn more</a></p>
          </div>
        </div>
        <div className="p-8">
          join Class
          
        </div>
      </div>
    </div>
  )
}

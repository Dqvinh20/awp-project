import React from 'react'
import 'react-banner/dist/style.css'

export default function BannerClass(props : {title :string}) {
  return (
    <div className="w-3/5 flex items-end rounded-md bg-cover bg-center h-60 text-white px-10 object-fill border-slate-300" style={{backgroundImage: 'url(https://gstatic.com/classroom/themes/img_graduation.jpg)'}}>
       <div className="md:w-1/2">
        {/* <p className="font-bold text-sm uppercase">Services</p> */}
        <p className="text-3xl font-bold text-left">{props.title}</p>
        {/* <p className="text-2xl mb-10 leading-none">Atractive designs for your brand</p> */}
        </div>  
    </div>
  );
}

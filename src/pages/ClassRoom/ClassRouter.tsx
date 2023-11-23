import React from 'react'
import ClassLayOut from './ClassLayOut'
import AboutClass from './component/AboutClass'
import ClassRoom from './component/ClassRoom'
import {Routes,Route,useMatches, useMatch, useLocation } from "react-router-dom"
export default function ClassRouter() {
  return (
    <Routes>
        <Route element={<ClassLayOut/>}>
            <Route index element={<AboutClass/>}/>
            <Route path=':id' element={<ClassRoom/>}/>
        </Route>
    </Routes>
  )
}

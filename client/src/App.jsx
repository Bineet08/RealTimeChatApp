import React from 'react'
import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

const App = () => {
  return (
    <div className="bg-[url('./assets/bg.jpg')] bg-cover bg-center min-h-screen">

      <Routes>
        <Route path='/' element = {<HomePage/>} />
        <Route path = 'login' element = {<LoginPage/>} />
        <Route path = 'profile' element = {<ProfilePage/>} />
      </Routes>
      </div>
  )
}

export default App
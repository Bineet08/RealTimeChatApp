import React, { useContext } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { AuthContext } from '../context/AuthContext.jsx'

const App = () => {
  const { authUser, isLoading } = useContext(AuthContext)

  if (isLoading) {
    return (
      <div className="bg-[url('./assets/bg.jpg')] bg-cover bg-center min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-[url('./assets/bg.jpg')] bg-cover bg-center min-h-screen">
      <Toaster />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to='/login' />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to='/' />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  )
}

export default App
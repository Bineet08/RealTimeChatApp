import React, { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [currState, setCurrState] = useState('signup');
  const [fullName, setFullName] = useState('');  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext)

  const onSubmitHandler = (e) => {
    e.preventDefault();
    
    if (currState === 'signup' && !isDataSubmitted) {
      // Check if passwords match before proceeding
      if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      setIsDataSubmitted(true);
      return;
    }

    login(currState === 'signup' ? 'signup' : 'login', { fullName, email, password, bio });
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      <img src="#" alt="logo" className='w-[min(30vw,250px)]' />

      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 rounded-lg p-6 flex flex-col gap-6 shadow-lg'>
        <h2 className='text-2xl font-semibold capitalize'>{currState}
          <img src="#" alt="icon" className='w-5 cursor-pointer inline-block ml-2'/>
        </h2>

        {currState === 'signup' && !isDataSubmitted && (
          <input 
            onChange={(e) => setFullName(e.target.value)} 
            value={fullName}
            type="text" 
            className='p-2 border border-gray-500 rounded-md focus:outline-none bg-transparent text-white' 
            placeholder='Full Name' 
            required 
          />
        )}

        {!isDataSubmitted && (
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            type="email" 
            placeholder='Email Address' 
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white'
          />
        )}

        {!isDataSubmitted && (
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            type="password" 
            placeholder='Password' 
            required
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white'
          />
        )}

        {currState === 'signup' && !isDataSubmitted && (
          <input 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            value={confirmPassword} 
            type="password" 
            placeholder='Confirm Password' 
            required
            className={`p-2 border rounded-md focus:outline-none focus:ring-2 bg-transparent text-white ${
              confirmPassword && password !== confirmPassword 
                ? 'border-red-500 focus:ring-red-500' 
                : 'border-gray-500 focus:ring-indigo-500'
            }`}
          />
        )}

        {currState === 'signup' && !isDataSubmitted && confirmPassword && password !== confirmPassword && (
          <p className='text-red-400 text-sm -mt-4'>Passwords do not match</p>
        )}

        {currState === 'signup' && isDataSubmitted && (
          <textarea 
            name="bio" 
            rows={4} 
            onChange={(e) => setBio(e.target.value)} 
            value={bio} 
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-white resize-none' 
            placeholder='Bio....'
          />
        )}

        <button type='submit' className='py-3 bg-linear-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:from-purple-500 hover:to-violet-700 transition-all'>
          {currState === 'signup' ? (isDataSubmitted ? 'Create Account' : 'Continue') : 'Login'}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-400'>
          <input type="checkbox" className='cursor-pointer' />
          <p>Agree to the terms and conditions</p>
        </div>

        <div>
          {currState === 'signup' ? (
            <p className='text-sm text-gray-400'>
              Already have an account?{' '}
              <span 
                onClick={() => { setCurrState("login"); setIsDataSubmitted(false); }} 
                className='font-medium text-violet-400 cursor-pointer hover:text-violet-300'
              >
                Login here
              </span>
            </p>
          ) : (
            <p className='text-sm text-gray-400'>
              Don't have an account?{' '}
              <span 
                onClick={() => setCurrState("signup")} 
                className='font-medium text-violet-400 cursor-pointer hover:text-violet-300'
              >
                Sign Up here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import  axiosInstance  from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';

function Login({setCurrentPage}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { updateUser }=useContext(UserContext);
  const navigate = useNavigate();


   const handleLogin = async (e) => {
    e.preventDefault();
     if(!validateEmail(email)) {setError('Please enter a correct email address'); return;}
    if(!password) { setError('Please enter a correct password'); return;}

    setError("");


    //login api call
    try{
       const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {email, password,});
      const { token } = response.data;
      if(token){
      localStorage.setItem('token', token);
      updateUser(response.data);
      navigate("/dashboard");
      }
    } catch(error){
      if(error.response && error.response.data.message) setError(error.response.data.message);
      else {
        setError("Something went wrong. Please try again later.");
      }
    }
   };

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
    <h3 className='text-xl font-bold text-black'>:
👋 Welcome back!</h3>
    <p className='text-sm text-slate-900 mt-[5px] mb-6'>Log in to access your dashboard and keep up with your interview prep.
    </p>

    <form onSubmit={handleLogin}>
      <Input
        label="Email Address"
        type="email"
        placeholder="testuser@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
         <Input
        label="Password"
        type="password"
        placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
          {error && <p className="text-red-500 text-sm pb-2.5">{error}</p>}
        <button type="submit" className='btn-primary'>Log In</button>
        <p className='text-[20px] text-slate-800 mt-3'>
          Don't have an account?{' '}
          <button
            className="font-medium text-primary underline cursor-pointer"
            onClick={() => setCurrentPage('signup')}
          >
            Sign Up
          </button>
        </p>
  </form>
  </div>

  )
}

export default Login
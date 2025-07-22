import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Inputs/Input';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { validateEmail } from '../../utils/helper';
import { UserContext } from '../../context/userContext';
import { useContext } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import uploadImage from '../../utils/uploadImage';

const SignUp = ({setCurrentPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [fullName, setFullName] = useState('');
  const [profilePic, setProfilePic] = useState(null);

  const { updateUser }=useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
      let profileImageUrl = "";
       if(!fullName) { 
        setError('Please enter a full name'); return;
      }
    if(!validateEmail(email)) {
      setError('Please enter a valid email address'); return;
    }
    if(!password) {
       setError('Please enter a password'); return;
      }

    setError("");

    try {
       if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name: fullName,
      email,
      password,
      profileImageUrl,
    });
    const {token} = response.data;
      if (token) {
      localStorage.setItem("token", token);
      updateUser(response.data);
      navigate('/dashboard');
    }
    } catch(error) {
      if(error.response && error.response.data.message) setError(error.response.data.message);
      else {
        setError("Something went wrong. Please try again later.");
      }
    }

  };

  return (
      <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className="text-xl font-bold text-black ">
        Create an Acount
      </h3>
      <p className="text-sm text-slate-900 mt-[5px] mb-6">
        🎉 New here? Create your free account to access personalized AI interview prep.
      </p>
<form onSubmit={handleSignUp}>
    <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
  <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
  <Input
    label="Full Name" 
    type="text"
    placeholder="Ayush Gupta"
    value={fullName}
    onChange={(e) => setFullName(e.target.value)} required
  />
  <Input
    label="Email Address" 
    type="email"  
    placeholder="testuser@gmail.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)} required
  />
  <Input
    label="Password" 
    type="password"
    placeholder="Min 8 characters"
    value={password}
    onChange={(e) => setPassword(e.target.value)} required
  />
  
</div>
{error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

<button type="submit" className="btn-primary">
  Sign Up
</button>

<p className="text-[20px] text-slate-800 mt-3">
  Already have an account?{' '}
  <button className="text-primary font-medium underline cursor-pointer" onClick={() => setCurrentPage('login')}>
    Log In
  </button>
</p>

</form>
 </div>
  )
}

export default SignUp
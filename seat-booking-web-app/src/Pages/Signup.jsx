import { useState, useEffect } from 'react'
import AuthHeader from '../Components/AuthHeader'
import InputCompo from '../Components/InputCompo'
import Quotes from '../Components/Quotes'
import AuthButton from '../Components/AuthButton'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LoadingButton from '../Components/LoadingButton'
import { AlertCircle, Check } from 'lucide-react';


const Signup = () => {
    const navigate = useNavigate();
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [PostInput, setPostInput] = useState({
        email: "",
        password: "",
        name: ""
    });
    const [showPassword, setShowpassword] = useState(false);
    function handleChangePasswordStatus() {
        setShowpassword(!showPassword);
    }

    const signupuser = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/registeruser`, PostInput);
            setLoading(false);
            const token = res.data.token;
            if (!token) {
                showToast('Sign up Error', 'error');
            }
            localStorage.setItem("token", `Bearer ${token}`);
            showToast('Signup successfully', 'success');
            navigate("/ticket-booking");
        } catch (e) {
            setLoading(false);
            if (e.response.data.code && e.response.data.code === 'validation-error') {
              let errorArr = [...e.response.data.error];
              errorArr.forEach(errorobj => {
                  showToast(errorobj.message, 'error');
              })
              return;
          }
            showToast(e.response.data.error, 'error');
            return;
        }
    }

      const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => {
          setToast({ show: false, message: '', type: '' });
        }, 3000);
      };
      
      // Hide toast after 3 seconds
      useEffect(() => {
        if (toast.show) {
          const timer = setTimeout(() => {
            setToast({ ...toast, show: false });
          }, 3000);
          return () => clearTimeout(timer);
        }
      }, [toast]);

   
    return (
        <div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
                <div className="h-screen flex justify-center items-center">
                    <div className='p-3 w-full md:w-1/2'>
                        <AuthHeader subheading='Already have an account? ' subHeadlink='/signin' subHead='login' />
                        <div className='mt-5'>
                            <div className='mt-4'>
                                <InputCompo label="Name" placeholder="Enter your name" onChange={(e) => { setPostInput(data => ({ ...data, name: e.target.value })) }} />
                            </div>
                            <div className='mt-4'>
                                <InputCompo label="Email" placeholder="Enter your email" onChange={(e) =>
                                    setPostInput(data => ({ ...data, email: e.target.value }))
                                } />
                            </div>
                            <div className='mt-4 '>
                                <InputCompo label="Password" type={!showPassword ? "password" : "text"} placeholder="Enter your password" onChange={(e) => { setPostInput(data => ({ ...data, password: e.target.value })) }} />
                                <img className='w-5 cursor-pointer relative -top-7.5 left-67.5' src={!showPassword ? "/eyeslash.svg" : "/eye.svg"} alt="" onClick={handleChangePasswordStatus} />
                            </div>
                        </div>
                        <div className='text-center mt-5'>
                            {loading ? <LoadingButton label='Sign up'/> :
                                <AuthButton buttonVal='Sign up' onClick={signupuser} />}
                        </div>
                    </div>
                </div>
                <div className='hidden lg:block'>
                    <Quotes />
                </div>
            </div>
            {/* Toast Notification */}
                  {toast.show && (
                    <div className={`fixed bottom-4 right-4 max-w-md p-4 rounded-md shadow-lg flex items-center gap-3 transition-opacity ${
                      toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                      {toast.type === 'error' ? 
                        <AlertCircle className="h-5 w-5" /> : 
                        <Check className="h-5 w-5" />
                      }
                      <p>{toast.message}</p>
                    </div>
                  )}
        </div>
    )
}

export default Signup

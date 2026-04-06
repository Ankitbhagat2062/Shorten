"use client";

import React, { useEffect, useState } from 'react';
import { useUrlStore } from '@/store/useUrlStore';
import { Toast } from '@/lib/icons';
import { redirect } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
const Register = () => {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('signin');
  const [formData, setFormData] = useState({
    email: '',
  });
  const [errors, setErrors] = useState({
    email: '',
  });
  const [touched, setTouched] = useState({
    email: false,
  });
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const { deviceId, setDeviceId } = useUrlStore();
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    if (session) {
      redirect('/')
    }
    setDeviceId()
  }, [session])
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateField = (name, value) => {
    let error = '';

    if (name === 'email') {
      if (!value.trim()) {
        error = 'Email is required';
      } else if (!validateEmail(value)) {
        error = 'Please enter a valid email address';
      }
    }

    return error;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fieldsToValidate = activeTab === 'signup'
      ? ['email']
      : ['email'];

    setTouched({
      name: activeTab === 'signup',
      email: true,
    });
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    console.log(deviceId)
    var raw = JSON.stringify({
      "email": formData.email,
      "deviceId": deviceId
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    await fetch("http://localhost:3000/api/send-otp", requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          addToast(result.message, 'success');
        }
        else {
        console.log(result);
          addToast(result.message, 'error')
        }
      })
      .catch(error => {
        addToast(error.message, 'error')
      });
    const newErrors = {};
    fieldsToValidate.forEach(field => {
      newErrors[field] = validateField(field, formData[field]);
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== '');
    if (!hasErrors) {
      addToast('Email Sumbmitted ', 'success')
      setStep(2);
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrors('Please enter the complete 6-digit code');
      return;
    }
    setErrors('');
    setIsLoading(true);

    try {
      // Get email from formData
      const userEmail = formData.email;
      // Extract username from email (remove @ and domain)
      const username = userEmail.split('@')[0];
      // NextAuth signIn does the work of /api/verify-otp for you
      const result = await signIn("otp-login", {
        email: userEmail,
        otp: otpCode, // Send the string, not the array
        redirect: false
      });

      if (result?.ok) {
        addToast("Login Successful", 'success');
        router.push(`/get-started?username=${username}`);
      } else {
        setErrors("Invalid or expired OTP");
        addToast("Invalid or expired OTP", 'error');
      }
    } catch (error) {
      setErrors("An error occurred. Please try again.");
      addToast("An error occurred. Please try again.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key press for OTP
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleEmailOTP = () => {
    setStep(1)
    console.log('Signing in with Email OTP');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl glass-card rounded-3xl overflow-hidden animate-fade-in-up">
        <div className="flex flex-col lg:flex-row min-h-150">

          {/* Left Side - Branded Illustration */}
          <div className="hidden items-center flex-col justify-around lg:flex lg:w-1/2 relative bg-linear-to-br from-[#667eea] to-[#764ba2] 
          p-12 overflow-hidden gap-4">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full animate-float"></div>
              <div className="absolute top-40 right-20 w-24 h-24 border-4 border-white rounded-full animate-float delay-200"></div>
              <div className="absolute bottom-20 left-20 w-40 h-40 border-4 border-white rounded-full animate-float delay-300"></div>
              <div className="absolute bottom-40 right-10 w-20 h-20 bg-white/30 rounded-full animate-float delay-100"></div>
              <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/20 rounded-full animate-float delay-400"></div>
            </div>

            <div className="relative z-10">
              <Link href={'/'} className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <span className="text-3xl font-bold text-white">Shorten</span>
              </Link>

              <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                Shorten Your URLs<br />
                <span className="text-white/80">Simplify Your Links</span>
              </h1>
              <p className="text-white/80 text-lg">
                Create memorable, trackable links in seconds. Join thousands of users who trust Shorten for their URL management needs.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">10M+</div>
                <div className="text-white/70 text-sm">Links Created</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">500K+</div>
                <div className="text-white/70 text-sm">Active Users</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-white/70 text-sm">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 bg-[#0a0a0a]/90 backdrop-blur-xl">
            {/* Mobile Brand Header */}
            <Link href={'/'} className="lg:hidden flex items-center gap-3 mb-8 justify-center">
              <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <span className="text-2xl font-bold gradient-text">Shorten</span>
            </Link>

            {/* Tab Toggle */}
            <div className="flex mb-8 bg-[#1a1a1a] rounded-2xl p-1.5">
              <button
                onClick={() => setActiveTab('signin')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'signin'
                  ? 'bg-linear-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'signup'
                  ? 'bg-linear-to-r from-[#667eea] to-[#764ba2] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
                  }`}
              >
                Sign Up
              </button>
            </div>

            {/* Benefits Banner - Show on Sign Up */}
            {activeTab === 'signup' && (
              <div className="mb-6 p-4 bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 border border-[#667eea]/30 rounded-2xl animate-fade-in-up">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-linear-to-r from-[#667eea] to-[#764ba2] rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <p className="text-white/90 font-medium">
                    Register to save your data across devices
                  </p>
                </div>
              </div>
            )}

            {/* Form Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                {activeTab === 'signin' ? 'Welcome back!' : 'Create your account'}
              </h2>
              <p className="text-gray-400">
                {activeTab === 'signin'
                  ? 'Enter your details to access your account'
                  : 'Start shortening URLs in seconds'}
              </p>
            </div>

            {/* Social Login Buttons */}
            {step === 0 && (
              <>
                <div className="space-y-3 mb-6">
                  {/* Google */}
                  <button
                    onClick={() => signIn('google')}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                  </button>

                  {/* GitHub */}
                  <button
                    onClick={() => signIn('github')}
                    className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-[#24292e] hover:bg-[#2f363d] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-gray-700"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    Continue with GitHub
                  </button>

                </div>
                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#0a0a0a] text-gray-500">or continue with email</span>
                  </div>
                </div>
              </>
            )}


            {/* Email OTP */}
            <div className="flex flex-col">
              {step === 0 && (
                <button
                  onClick={handleEmailOTP}
                  className="w-full flex items-center justify-center gap-3 py-3.5 px-6 bg-transparent border-2 border-[#667eea] hover:bg-[#667eea]/10 text-[#667eea] hover:text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Continue with Email OTP
                </button>
              )}
              {step === 1 && (
                <>
                  {/* Submit Email Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="Enter your email"
                        className={`w-full px-4 py-3.5 bg-[#1a1a1a] border-2 rounded-xl text-white placeholder-gray-500 focus:outline-none transition-all duration-300 ${errors.email && touched.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-700 focus:border-[#667eea]'
                          }`}
                      />
                      {errors.email && touched.email && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Send Otp */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-linear-to-r from-[#667eea] to-[#764ba2] hover:from-[#7a8ff5] hover:to-[#8a5cb8] text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#667eea]/30 mt-6"
                    >
                      Send Otp
                    </button>
                  </form>
                </>
              )}
              {step === 2 && (
                <>
                  <form onSubmit={handleOtpSubmit}>
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-600">Verifying your code...</p>
                      </div>
                    ) : (
                      <>
                        <div className="mb-4">
                          <h3 className="block text-sm font-medium text-gray-700 mb-2">
                            Enter 6-digit code
                          </h3>
                          <p className="text-sm text-gray-500 mb-4">
                            We sent a verification code to {formData.email}
                          </p>
                          <div className="flex justify-center gap-2">
                            {otp.map((digit, index) => (
                              <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                className="w-12 h-12 text-gray-700 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                              />
                            ))}
                          </div>
                        </div>

                        <button disabled={isLoading}
                          type="submit"
                          className="w-full cursor-pointer py-3 px-4 bg-linear-to-r disabled:from-blue-300 disabled:to-purple-300 from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                        >
                          Verify
                        </button>
                      </>
                    )}
                  </form>
                </>
              )}
              {step !== 0 && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => { setStep(step - 1) }}
                    className="text-sm cursor-pointer text-blue-600 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              )}
            </div>

            {/* Terms and Privacy */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm">
                By continuing, you agree to our{' '}
                <a href="/terms" className="text-[#667eea] hover:text-[#7a8ff5] underline-offset-2 hover:underline transition-colors">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-[#667eea] hover:text-[#7a8ff5] underline-offset-2 hover:underline transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>

            {/* Sign In prompt for Sign Up tab */}
            {activeTab === 'signup' && (
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signin')}
                    className="text-[#667eea] hover:text-[#7a8ff5] font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            )}

            {/* Sign Up prompt for Sign In tab */}
            {activeTab === 'signin' && (
              <div className="mt-6 text-center">
                <p className="text-gray-400">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setActiveTab('signup')}
                    className="text-[#667eea] hover:text-[#7a8ff5] font-semibold transition-colors"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Register;

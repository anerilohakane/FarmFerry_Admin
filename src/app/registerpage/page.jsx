"use client";

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Wheat, MapPin, Users, Leaf, Sun, CloudRain } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { registerAdmin } from '@/utils/api'; // Import the new API function
import FarmFerryLogo from "@/../public/images/Farm-Ferry-logo.jpeg";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Use login from AuthContext to auto-login after registration if desired,
  // or just redirect to login page.
  const { login: authLogin } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
        newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError('');

    try {
      const response = await registerAdmin(formData);
      
      // Auto-login or redirect?
      // The register API returns { success: true, data: { admin, accessToken } }
      // We can use the token to log them in immediately if we want, 
      // but AuthContext mighty expect a login call. 
      // Safest route -> Redirect to login page or use the context helper if available.
      
      // Check if response has accessToken (it should based on backend code)
      // For now, let's redirect to login with a success message query param or just simple replace.
      // Or we can manually set the token and update context state if exposed.
      // Re-using the login flow is cleaner for the frontend state.
      
      await authLogin(formData.email, formData.password);
      localStorage.removeItem('adminSidebarActive');
      router.replace('/admin');

    } catch (err) {
      setApiError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex">
      {/* Left Side - Enhanced Project Branding (Same as Login) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/15 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white/10 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-white/15 rounded-full animate-pulse delay-700"></div>
          
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-orange-400/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-28 h-28 bg-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
          
          <div className="absolute top-1/3 right-1/4 animate-bounce delay-300">
            <Leaf className="w-8 h-8 text-white/20" />
          </div>
          <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-700">
            <Sun className="w-6 h-6 text-yellow-300/30" />
          </div>
          <div className="absolute top-2/3 left-1/5 animate-bounce delay-1000">
            <CloudRain className="w-7 h-7 text-blue-300/30" />
          </div>
        </div>
        
        <div className="ml-40 relative z-10 flex flex-col justify-center items-center text-center px-12 py-8 text-white h-full">
          <div className="mb-8">
            <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-lg rounded-full mb-6 shadow-2xl">
              <img src={FarmFerryLogo.src} alt="Farm Ferry Logo" className="w-24 h-24 rounded-full z-10" />
            </div>
            <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-white via-green-100 to-yellow-200 bg-clip-text text-transparent">
              FarmFerry
            </h1>
            <p className="text-xl text-green-100 font-medium">
              Join the Revolution
            </p>
          </div>
          
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                <Wheat className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold">Fresh Produce</h3>
                <p className="text-green-100 text-sm">Direct from local farms</p>
              </div>
            </div>
            
             <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4 transform hover:scale-105 transition-all duration-300 hover:bg-white/15 border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-lg">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="text-base font-semibold">Fast Delivery</h3>
                <p className="text-green-100 text-sm">Same-day local delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="relative inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-3 shadow-xl">
              <img src={FarmFerryLogo.src} alt="Farm Ferry Logo" className="w-14 h-14 object-contain rounded-full z-10" />
            </div>
            <h1 className="text-2xl font-bold text-green-800 mb-1">Farm Ferry</h1>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-green-100/50">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
              <p className="text-gray-600 text-sm">Join us as an Administrator</p>
            </div>
            
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-center text-sm">
                {apiError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium">First Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900" />
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-9 pr-4 py-3 border ${errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/70'} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm`}
                            placeholder="First Name"
                        />
                    </div>
                     {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-gray-700 text-sm font-medium">Last Name</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-900" />
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-9 pr-4 py-3 border ${errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/70'} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-sm`}
                            placeholder="Last Name"
                        />
                    </div>
                    {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/70'} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="name@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-900" />
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/70'} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="10-digit mobile number"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2">
                <label className="text-gray-700 text-sm font-medium">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-900 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white/70'} rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
              
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-3 px-4 rounded-xl font-medium hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-2"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-gray-500 text-sm">
                Already have an account? 
                <button 
                  type="button" 
                  onClick={() => router.push('/loginpage')}
                  className="text-green-600 hover:text-green-700 ml-1 transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

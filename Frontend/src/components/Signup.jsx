import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import immm from '../assets/s.png';
import config from "../config";

export default function Signup() {
  const [showCreatePass, setShowCreatePass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  
  const inputRefs = useRef([]);
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  function changeHandler(event) {
    const { name, value } = event.target;
    if (name === "email") {
      setEmailError(!emailRegex.test(value));
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4);
    if (/^\d{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[3]?.focus();
    }
  };

  async function postdata_into_database(e) {
    e.preventDefault();
    if (emailError || !emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return;
    }
    if (!mobileRegex.test(formData.mobileNumber)) {
      toast.error("Invalid mobile number format");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!validatePassword(formData.password)) {
      toast.error(
        'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/user/createmessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          e_mail: formData.email,
          mobile_number: formData.mobileNumber,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("OTP sent to your email!");
        setUserData(data.data);
        setShowOtpForm(true);
      } else if (res.status === 400 && data.message === "User with this email already exists") {
        toast.error("User already exists with this email");
      } else if (res.status === 400 && data.message === "Password and confirm password do not match") {
        toast.error("Password and Confirm Password do not match");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Error connecting to the server");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const verifyOtp = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    setIsOtpLoading(true);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/user/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otpString,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("Email verified successfully!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobileNumber: "",
          password: "",
          confirmPassword: "",
        });
        navigate('/login');
      } else {
        toast.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error("Error verifying OTP");
      console.error("Error:", error);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/user/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error("Error resending OTP");
      console.error("Error:", error);
    }
  };

  const goBackToForm = () => {
    setShowOtpForm(false);
    setOtp(['', '', '', '']);
    setUserData(null);
  };

  if (showOtpForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Verify Email</h3>
              <p className="text-gray-600">We've sent a 4-digit code to</p>
              <p className="text-blue-600 font-medium">{formData.email}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP
              </label>
              <div className="flex justify-center space-x-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    style={{ caretColor: 'transparent' }}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={verifyOtp}
              disabled={isOtpLoading || otp.join('').length !== 4}
              className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
            >
              {isOtpLoading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <div className="text-center space-y-3">
              <button
                onClick={resendOtp}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Resend OTP
              </button>
              <div>
                <button
                  onClick={goBackToForm}
                  className="text-gray-600 hover:text-gray-700 text-sm"
                >
                  ← Back to Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 p-12 text-white flex flex-col justify-center items-center">
            <img
              src={immm}
              alt="Hotel check-in illustration"
              className="mb-8 rounded-2xl h-[300]"
            />
            <h2 className="text-3xl font-bold mb-4">Welcome</h2>
            <p className="text-blue-100 text-center">Sign up to create your account and enjoy our services</p>
          </div>
          
          <div className="md:w-1/2 p-12">
            <div className="max-w-sm mx-auto">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Sign Up</h3>
              
              <form onSubmit={postdata_into_database} className="space-y-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={changeHandler}
                    className={`w-full px-4 py-2 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {emailError && <span className="text-red-500 text-sm">Email is not valid</span>}
                  {emailExists && <span className="text-red-500 text-sm">User already exists with this email</span>}
                </div>

                <div>
                  <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <FaPhone className="text-gray-400" />
                    </span>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      required
                      placeholder="Enter Mobile Number"
                      value={formData.mobileNumber}
                      onChange={changeHandler}
                      className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Create Password
                  </label>
                  <input
                    type={showCreatePass ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCreatePass(!showCreatePass)}
                    className="absolute right-3 top-8 text-gray-400"
                  >
                    {showCreatePass ? (
                      <AiOutlineEyeInvisible className="text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-2xl" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={changeHandler}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-8 text-gray-400"
                  >
                    {showConfirmPass ? (
                      <AiOutlineEyeInvisible className="text-2xl" />
                    ) : (
                      <AiOutlineEye className="text-2xl" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
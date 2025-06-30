import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordPage() {
  const [step, setStep] = useState('request'); // request, verify, success
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const inputRefs = useRef([]);
  const navigate = useNavigate()

  useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend && step === 'verify') {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend, step]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial
    };
  };

  const handleRequestReset = async () => {
    setErrors({});

    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to request password reset
      const response = await axios.post('http://localhost:4000/api/auth/send-reset-otp', {email});

      const data =  response.data;

      if (data.success) {
        setStep('verify');
        setCountdown(60);
        setCanResend(false);
      } else {
        setErrors({ email: data.message || 'Failed to send reset code' });
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors({ ...errors, otp: '' });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    setErrors({ ...errors, otp: '' });

    const nextEmptyIndex = newOtp.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleResetPassword = async () => {
    setErrors({});

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit code' });
      return;
    }

    if (!newPassword) {
      setErrors({ password: 'New password is required' });
      return;
    }

    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setErrors({ password: 'Password does not meet requirements' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      // API call matching your backend structure
      const response = await axios.post('http://localhost:4000/api/auth/reset-password', 
       {
          email,
          otp: otpCode,
          newPassword
        }
      );

      const data =  response.data;

      if (data.success) {
        setStep('success');
      } else {
        if (data.message.includes('Invalid OTP')) {
          setErrors({ otp: 'Invalid verification code' });
        } else if (data.message.includes('Expired OTP')) {
          setErrors({ otp: 'Verification code has expired' });
        } else {
          setErrors({ general: data.message || 'Failed to reset password' });
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };
        

  const handleResend = async () => {
    setIsLoading(true);
    setCanResend(false);
    setCountdown(60);
    setOtp(['', '', '', '', '', '']);
    setErrors({});

    try {
      const response = await axios.post('http://localhost:4000/api/auth/reset-password', {email});

      const data = response.data;
      if (!data.success) {
        setErrors({ general: data.message || 'Failed to resend code' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
      inputRefs.current[0]?.focus();
    }
  };

  const handleGoBack = () => {
    if (step === 'verify') {
      setStep('request');
      setOtp(['', '', '', '', '', '']);
      setErrors({});
    } else {
      // Navigate to login page
      navigate('/login')
    }
  };

  const passwordValidation = validatePassword(newPassword);

  const renderRequestStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Lock className="w-10 h-10 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Reset Password</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Enter your email address and we'll send you a verification code to reset your password.
      </p>
      
      <div className="space-y-6">
        <div className="text-left">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <button
          onClick={handleRequestReset}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Sending Code...
            </>
          ) : (
            'Send Reset Code'
          )}
        </button>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <button 
          onClick={handleGoBack}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center mx-auto transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </button>
      </div>
    </div>
  );

  const renderVerifyStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-10 h-10 text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Enter Reset Code</h1>
      <p className="text-gray-600 mb-2">
        We've sent a 6-digit code to
      </p>
      <p className="text-blue-600 font-semibold mb-8">{email}</p>
      
      <div className="space-y-6">
        {/* OTP Input */}
        <div>
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={`w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
                autoFocus={index === 0}
              />
            ))}
          </div>
          {errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp}</p>}
        </div>

        {/* New Password */}
        <div className="text-left">
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {newPassword && (
            <div className="mt-2 text-xs space-y-1">
              <div className={`flex items-center ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                <span className="mr-1">{passwordValidation.minLength ? '✓' : '✗'}</span>
                At least 8 characters
              </div>
              <div className={`flex items-center ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
                <span className="mr-1">{passwordValidation.hasUpper ? '✓' : '✗'}</span>
                One uppercase letter
              </div>
              <div className={`flex items-center ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-500'}`}>
                <span className="mr-1">{passwordValidation.hasLower ? '✓' : '✗'}</span>
                One lowercase letter
              </div>
              <div className={`flex items-center ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                <span className="mr-1">{passwordValidation.hasNumber ? '✓' : '✗'}</span>
                One number
              </div>
              <div className={`flex items-center ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-red-500'}`}>
                <span className="mr-1">{passwordValidation.hasSpecial ? '✓' : '✗'}</span>
                One special character
              </div>
            </div>
          )}
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div className="text-left">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 focus:outline-none transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-5 h-5 text-gray-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        {errors.general && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}

        <button
          onClick={handleResetPassword}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>

        <button 
          onClick={canResend ? handleResend : undefined}
          disabled={!canResend || isLoading}
          className="w-full bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
        </button>
      </div>

      <div className="mt-6">
        <button 
          onClick={handleGoBack}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center mx-auto transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Change Email
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Password Reset Successfully!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your password has been reset successfully. You can now log in with your new password.
      </p>
      <button 
        onClick={() => navigate('/login')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Continue to Login
      </button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 'request':
        return renderRequestStep();
      case 'verify':
        return renderVerifyStep();
      case 'success':
        return renderSuccessStep();
      default:
        return renderRequestStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {renderStep()}
        </div>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}
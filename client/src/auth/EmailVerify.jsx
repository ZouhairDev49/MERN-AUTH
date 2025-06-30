import React, { useState, useEffect } from "react";
import {
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  Send,
} from "lucide-react";
import axios from "axios";

const EmailVerificationPage = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Timer for OTP expiration
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && step === 2) {
      setCanResend(true);
    }
  }, [timeLeft, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const sendOtp = async () => {
    setLoading(true);
    setMessage("");

    try {
      // axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/send-verify-otp",
        {},
        {withCredentials:true}
      );
      

      if (data.success) {
        setMessage(data.message);
        setMessageType("success");
        setStep(2);
        setTimeLeft(600); // 10 minutes
        setCanResend(false);
      } else {
        setMessage(data.message || "Something went wrong");
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to send OTP. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter the OTP");
      setMessageType("error");
      return;
    }

    if (otp.length !== 6) {
      setMessage("OTP must be 6 digits");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      //  axios.defaults.withCredentials = true
      // API call - user identity handled by authentication (JWT/session)
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/verify-account",
        { otp },
        { withCredentials: true }
      );

      // const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType("success");
        setStep(3); // Success step
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      setMessage("Failed to verify OTP. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setTimeLeft(0);
    setCanResend(true);
    setStep(1);
    setMessage("");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600">
          Click the button below to send a verification code to your registered
          email
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={sendOtp}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Send Verification Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Enter Verification Code
        </h2>
        <p className="text-gray-600">We've sent a 6-digit code to your email</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-center text-lg font-mono tracking-widest"
            placeholder="000000"
            maxLength="6"
            disabled={loading}
          />
        </div>

        {timeLeft > 0 && (
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Code expires in {formatTime(timeLeft)}</span>
          </div>
        )}

        <button
          onClick={verifyOtp}
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Shield className="w-5 h-5" />
              <span>Verify Code</span>
            </>
          )}
        </button>

        {canResend && (
          <button
            onClick={handleResendOtp}
            className="w-full text-blue-600 hover:text-blue-800 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Didn't receive the code? Send again
          </button>
        )}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="text-center space-y-6">
      <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verified!
        </h2>
        <p className="text-gray-600">
          Your email has been successfully verified
        </p>
      </div>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800">✓ Your account is now fully activated</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center space-x-2 ${
                messageType === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {messageType === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <p className="text-sm">{message}</p>
            </div>
          )}
        </div>

        {step < 3 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerificationPage;

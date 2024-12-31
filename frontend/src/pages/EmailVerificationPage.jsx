import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyEmail, isLoading, error } = useAuthStore();

  const handleChange = (index, value) => {
    const newCode = [...code];
    // handle pasted text
    if (value.length > 1) {
      const pastedText = value.split("");
      for (let i = 0; i < 6; i++) {
        newCode[index + i] = pastedText[i] || "";
      }
      setCode(newCode);

      //   focus on the last non-empty input or the first empty input
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      // move focus to the next input
      if (index < 5 && value) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !code[index]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    try {
      const response = await verifyEmail({ verificationCode });
      navigate("/");
      toast.success("Email verified successfully");
    } catch (error) {
      console.error("Error verifying email", error);
    }
  };

  //   auto submit when all fields are filled
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="max-w-md w-full bg-gray-800 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-lg shadow-xl overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-sm mb-6 text-center">
          We&apos;ve sent a verification code to your email. Please enter the
          6-digit code below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            ))}
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <motion.button
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
          >
            {isLoading ? "Verify..." : "Verify Email"}
          </motion.button>
        </form>

        <p className="text-gray-400 text-sm mt-6 text-center">
          Didn&apos;t receive the email?{" "}
          <Link
            to="/resend-verification-email"
            className="text-green-400 hover:text-emerald-600 hover:underline"
          >
            Resend
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;

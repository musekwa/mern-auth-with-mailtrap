import { useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { Loader, Lock } from "lucide-react";
import toast from "react-hot-toast";

const ResetPasswordPage = () => {
  const { resetPassword, isLoading, error, message } = useAuthStore();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await resetPassword(password, token);
      toast.success(
        "Password reset successfully, redirecting to login page..."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.message || "Error resetting password");
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md w-full bg-gray-800 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-xl shadow-xl overflow-hidden p-8"
    >
      <div className="flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-6 text-center  bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
          Reset Password
        </h2>
        <p className="text-gray-300 text-sm">Please enter your new password.</p>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {message && <p className="text-green-500 text-sm">{message}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-8 justify-center"
      >
        <Input
          icon={Lock}
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          icon={Lock}
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <motion.button
          whileHover={{
            scale: 1.02,
          }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || !password || !confirmPassword}
          className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
        >
          {isLoading ? (
            <Loader className="size-6 animate-spin mx-auto" />
          ) : (
            "Reset Password"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default ResetPasswordPage;

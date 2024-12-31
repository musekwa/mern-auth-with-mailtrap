import React from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Mail, Lock, Loader } from "lucide-react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { useAuthStore } from "../authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, error } = useAuthStore();
  const handleLogin = async (e) => {
    e.preventDefault();
    await login({ email, password });
  };
  return (
    <motion.div
      className="max-w-md w-full bg-gray-800 bg-opacity-50 rounded-2xl backdrop-filter backdrop-blur-lg shadow-xl overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Welcom Back
        </h2>

        <form onSubmit={handleLogin}>
          <Input
            icon={Mail}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            icon={Lock}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex justify-between items-center mb-6">   
            <Link to="/forgot-password" className="text-green-400 hover:text-emerald-600 hover:underline">Forgot Password?</Link>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <motion.button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.98,
            }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <Loader className="animate-spin size-6 mx-auto" /> : "Login"}
          </motion.button>
        </form>
      </div>
      <div className="p-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
        <p className=" text-gray-400 text-sm ">
            Don&apos;t have an account? <Link className="text-green-400 hover:text-emerald-600 hover:underline" to="/signup">Sign Up</Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginPage;
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Utensils } from "lucide-react";

interface LoginPageProps {
  onLogin: () => void;
  onSwitchToSignup: () => void;
  onRoleSelect: (role: "admin" | "vendor") => void;
}

// Static credentials
const CREDENTIALS = {
  admin: {
    email: "admin@grocyon.com",
    password: "admin123",
  },
  vendor: {
    email: "vendor@grocyon.com",
    password: "vendor123",
  },
};

export default function LoginPage({
  onLogin,
  onSwitchToSignup,
  onRoleSelect,
}: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"admin" | "vendor">("admin");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate credentials based on selected role
    const validCredentials = CREDENTIALS[selectedRole];

    if (
      email === validCredentials.email &&
      password === validCredentials.password
    ) {
      onRoleSelect(selectedRole);
      onLogin();
    } else {
      setError("Invalid email or password. Please check your credentials.");
    }
  };

  const handleRoleChange = (role: "admin" | "vendor") => {
    setSelectedRole(role);
    setError("");
    // Auto-fill credentials for demo
    const credentials = CREDENTIALS[role];
    setEmail(credentials.email);
    setPassword(credentials.password);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Food Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-red-50 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          <div className="flex items-center space-x-3 mb-8">
            <img src="\public\image\logo\logo_main_bg.png" alt="logo"></img>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-4">
              Your
              <br />
              <span className="text-red-400">Kitchen</span>
              <br />
              Your Food....
            </h1>
            <p className="text-xl text-gray-200">
              Manage your restaurant business with our comprehensive food
              management system
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                <Utensils className="w-7 h-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-gray-800">grocyon</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center lg:text-right mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600 mb-4">Welcome Back</p>
            <div className="text-sm text-gray-500">
              Want To Login Your Admin?
              <button
                onClick={() => handleRoleChange("admin")}
                className={`ml-1 font-medium ${
                  selectedRole === "admin"
                    ? "text-red-600"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Admin Login
              </button>
              <span className="mx-2">|</span>
              <button
                onClick={() => handleRoleChange("vendor")}
                className={`font-medium ${
                  selectedRole === "vendor"
                    ? "text-red-600"
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                Vendor Login
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Login As
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("admin")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedRole === "admin"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Admin</div>
                    <div className="text-xs">Full Access</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("vendor")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedRole === "vendor"
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">Vendor</div>
                    <div className="text-xs">Restaurant Owner</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Email@address.com"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="8+ characters required"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-600">Remember Me</span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-lg"
            >
              Sign in
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Demo Credentials:
            </h4>
            <div className="text-xs text-gray-600 space-y-1">
              <div>
                <strong>Admin:</strong> admin@grocyon.com / admin123
              </div>
              <div>
                <strong>Vendor:</strong> vendor@grocyon.com / vendor123
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Don't have an account?{" "}
            </span>
            <button
              onClick={onSwitchToSignup}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

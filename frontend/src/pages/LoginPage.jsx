import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import AuthImagePattern from '../components/AuthImagePattern'
import { Link, useNavigate } from 'react-router-dom' // Import useNavigate for redirection
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from 'lucide-react'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const { login, isLoggingIn } = useAuthStore() // Use isLoggingIn instead of isSigningUp
  const navigate = useNavigate() // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData) // Call login function with form data
      navigate('/') // Redirect to the home page after successful login
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className='h-screen grid lg:grid-cols-2'>
      {/* Left Side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-6">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Sign In</h1> {/* Change to Sign In */}
              <p className="text-base-content/60">Access your account</p>
            </div>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email:</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-6 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10`}
                    placeholder='you@example.com'
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password:</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-6 text-base-content/40" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`input input-bordered w-full pl-10`}
                    placeholder='Password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type='button'
                    className='absolute inset-y-0 right-0 pr-3 flex items-center'
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className='size-6 text-base-content/40' />
                    ) : (
                      <Eye className='size-6 text-base-content/40' />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className='btn btn-primary w-full'
                disabled={isLoggingIn} // Use isLoggingIn here
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">
                Don't have an account?{" "}
                <Link to="/signup" className='link link-primary'>Create Account</Link> {/* Change to /signup link */}
              </p>
            </div>
          </div>
        </div>  
      </div>

      {/* Right Side */}
      <AuthImagePattern
        title="Welcome back"
        subtitle="Access your account and enjoy all the features."
      />
    </div>
  )
}

export default LoginPage

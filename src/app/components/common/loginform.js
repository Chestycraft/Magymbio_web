import React, { useState } from 'react';
import { supabase } from './../../supabase-client';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Data, setData] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const {error} = await supabase.auth.signInWithPassword({email,password})
    if(error){
        console.error(error)
        return  
    }
    return
  };

  const handleGoogleLogin = async () => {
  const { data, error:googleerror } = await supabase.auth.signInWithOAuth({
  provider: 'google',
   options: {
         redirectTo: `https://magymbio-web.vercel.app/user_dashboard`
    }
});
     if(googleerror){
        console.error(googleerror)
        return  
    }
    setData(data)
    return
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="backdrop-blur-lg bg-black/40 border border-white/30 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-6">MAGYMBO Login</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-white text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
             className="btn-glassy-white"
          >
            Log In
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleGoogleLogin}
       className="btn-glassy-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg">
              <path fill="#4285F4" d="M533.5 278.4c0-17.4-1.4-34.1-4.1-50.4H272.1v95.4h146.9c-6.3 33.7-25 62.3-53.4 81.3v67.5h86.4c50.5-46.6 81.5-115.4 81.5-193.8z"/>
              <path fill="#34A853" d="M272.1 544.3c72.9 0 134.1-24.2 178.8-65.8l-86.4-67.5c-24 16-54.7 25.5-92.3 25.5-71 0-131.2-47.9-152.7-112.2H30.9v70.6c44.9 88.5 136.4 149.4 241.2 149.4z"/>
              <path fill="#FBBC05" d="M119.4 324.3c-10.2-30.2-10.2-62.6 0-92.8V160.9H30.9c-30.8 61.5-30.8 133.5 0 195l88.5-67.6z"/>
              <path fill="#EA4335" d="M272.1 107.7c39.6-.6 77.6 14.5 106.7 42.5l79.9-79.9C407.6 24.2 346.4 0 272.1 0 167.3 0 75.8 60.9 30.9 149.4l88.5 67.5C140.9 155.6 201.1 107.7 272.1 107.7z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

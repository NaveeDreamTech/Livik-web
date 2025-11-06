"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });


  return (
    <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
      {/* Logo Container */}
      <div className="mb-6">
        <div className="w-[120px] h-[120px] rounded-full inline-flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] mb-4 overflow-hidden bg-white">
          <Image
            src="/asset/livik-logo.png"
            alt="Livik Logo"
            width={85}
            height={85}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Login Form */}
      <form className="flex flex-col gap-4" onSubmit={() => {}}>
        <div className="relative">
          <input
            type="text"
            className="w-full px-5 py-3.5 text-[15px] border-none rounded-lg bg-[#f5f5f5] text-[#333333] outline-none transition-all duration-300 placeholder:text-[#999] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,144,255,0.2)]"
            placeholder="Username or Email"
            name="username"
            value={formData.username}
            onChange={() => {}}
            required
            autoComplete="username"
            aria-label="Username or Email"
          />
        </div>

        <div className="relative">
          <input
            type="password"
            className="w-full px-5 py-3.5 text-[15px] border-none rounded-lg bg-[#f5f5f5] text-[#333333] outline-none transition-all duration-300 placeholder:text-[#999] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,144,255,0.2)]"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={() => {}}
            required
            autoComplete="current-password"
            aria-label="Password"
          />
        </div>

        {/* Full Width Login Button */}
        <button
          type="submit"
          className="w-full px-6 py-3.5 text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 outline-none bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873cc] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2 mt-2"
        >
          Login
        </button>

        {/* Forgot Password Link - Separate Line */}
        <button
          type="button"
          className="w-full text-[14px] font-medium cursor-pointer transition-all duration-300 outline-none text-[#1E90FF] hover:text-[#5eb8ff] underline focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2"
          onClick={() => {}}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
}

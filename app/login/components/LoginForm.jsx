"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";

export default function LoginForm({ onForgot, onSuccess, onLoginWithMobile }) {
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Login failed");
        setLoading(false);
        return;
      }

      console.log("LOGIN SUCCESS:", data);

      // 🔥 ONLY THIS SHOULD RUN
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {errorMsg && (
        <p className="text-red-500 text-sm text-center">{errorMsg}</p>
      )}

      <StyledInput
        name="phoneNumber"
        placeholder="Enter Mobile Number"
        value={form.phoneNumber}
        onChange={handleChange}
        required
      />

      <div className="relative">
        <StyledInput
          name="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          value={form.password}
          onChange={handleChange}
          required
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <StyledButton type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </StyledButton>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onLoginWithMobile}
          className="text-[14px] text-[#1E90FF] underline"
        >
          Login with Mobile
        </button>
        <button
          type="button"
          onClick={onForgot}
          className="text-[14px] text-[#1E90FF] underline"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState } from "react";
import StyledInput from "./StyledInput";
import StyledButton from "./StyledButton";

export default function LoginForm({ onForgot, onMobile }) {
  const [form, setForm] = useState({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    console.log(form)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token if needed
      // localStorage.setItem("token", data.token);

      console.log("LOGIN SUCCESS:", data);

      // Move to homepage or dashboard
      if (onMobile) onMobile(); // optional callback
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Try again.");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* Error Message */}
      {errorMsg && (
        <p className="text-red-500 text-sm text-center">{errorMsg}</p>
      )}

      <StyledInput
        name="phoneNumber"
        placeholder="Enter a Mobile Number"
        value={form.phoneNumber}
        onChange={handleChange}
        required
      />

      <StyledInput
        name="password"
        type="password"
        placeholder="Enter a Password"
        value={form.password}
        onChange={handleChange}
        required
      />

      <StyledButton type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </StyledButton>

      <div className="flex items-center justify-center">
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

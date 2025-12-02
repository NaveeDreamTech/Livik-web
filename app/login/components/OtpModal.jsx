"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X } from "lucide-react";

export default function OtpModal({ open, onClose, onPasswordExists, onPasswordNotExists }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // allow only digits

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    // Move to next box
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Verify OTP with Firebase
      const result = await window.confirmationResult.confirm(finalOtp);
      
      // Get mobile number from sessionStorage
      const mobile = sessionStorage.getItem("fp_mobile");
      
      if (!mobile) {
        setError("Mobile number not found. Please try again.");
        setLoading(false);
        return;
      }

      // Check if password exists in database
      const checkResponse = await fetch("/api/auth/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: mobile }),
      });

      const checkData = await checkResponse.json();

      if (!checkResponse.ok) {
        setError(checkData.error || "Failed to check password");
        setLoading(false);
        return;
      }

      // If password exists, route to dashboard
      if (checkData.hasPassword) {
        if (onPasswordExists) {
          onPasswordExists(checkData.user);
        } else {
          onClose("dashboard");
        }
      } else {
        // If password doesn't exist, open reset password modal
        if (onPasswordNotExists) {
          onPasswordNotExists();
        } else {
          onClose("reset");
        }
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose()} fullWidth maxWidth="sm">
      <DialogContent className="p-6 rounded-xl relative text-center">
        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black transition"
        >
          <X size={22} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>

        {/* OTP BOXES */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputs.current[index] = el)}
              value={digit}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl border rounded-lg focus:outline-none focus:border-blue-500"
              disabled={loading}
            />
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../../lib/firebaseClient";
import { getRecaptcha } from "../../../lib/firebaseRecaptcha";
import { X } from "lucide-react";

export default function ForgotPasswordModal({ open, onClose }) {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  // 🔥 Reset fields on modal close
  useEffect(() => {
    if (!open) {
      setMobile("");
      setError("");
    }
  }, [open]);

  const handleSendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }

    try {
      const appVerifier = getRecaptcha();
      const confirmation = await signInWithPhoneNumber(
        auth,
        `+91${mobile}`,
        appVerifier
      );

      window.confirmationResult = confirmation;

      // ⭐ STORE MOBILE BEFORE MOVING TO OTP SCREEN
      sessionStorage.setItem("fp_mobile", mobile);

      onClose("otp");
    } catch (err) {
      console.error("RESET PASSWORD ERROR FULL:", err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent className="p-6 rounded-xl relative">
        {/* CLOSE ICON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <div id="recaptcha-container"></div>

        <h2 className="text-xl font-semibold mb-3">Reset Password</h2>

        <label className="text-sm font-medium">Mobile Number</label>

        <div className="flex gap-2 items-center">
          <div className="px-3 py-2 bg-gray-100 rounded-lg">+91</div>

          <input
            type="text"
            value={mobile}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, "");
              if (v.length <= 10) setMobile(v);
            }}
            maxLength={10}
            className="border rounded-lg p-2 flex-1"
            placeholder="9876543210"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={handleSendOtp}
        >
          Send OTP
        </button>
      </DialogContent>
    </Dialog>
  );
}

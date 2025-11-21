import { useState, useRef } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X } from "lucide-react";

export default function OtpModal({ open, onClose }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
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
      return alert("Enter all 6 digits");
    }

    try {
      const result = await window.confirmationResult.confirm(finalOtp);
      onClose("reset");
    } catch (err) {
      alert("Invalid OTP");
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
            />
          ))}
        </div>

        <button
          className="w-full bg-blue-600 text-white py-2 rounded-lg"
          onClick={handleVerify}
        >
          Verify OTP
        </button>
      </DialogContent>
    </Dialog>
  );
}

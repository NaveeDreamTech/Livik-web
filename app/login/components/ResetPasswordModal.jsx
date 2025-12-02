import { useState } from "react";
import { Dialog, DialogContent } from "@mui/material";
import { X, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordModal({ open, onClose }) {
  const [pwd, setPwd] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPwd, setShowPwd] = useState(false);
  const [showCpwd, setShowCpwd] = useState(false);

  const validatePassword = (pwd) => {
    if (!pwd || pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(pwd))
      return "Password must contain at least one special character";
    return "";
  };

  const handleReset = async () => {
    const pwdError = validatePassword(pwd);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (pwd !== cpwd) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: sessionStorage.getItem("fp_mobile"), // store during OTP
          password: pwd,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      onClose("success");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose}>
      <DialogContent className="p-6 rounded-xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-4">Create New Password</h2>

        {/* New Password */}
        <div className="relative mb-4">
          <input
            type={showPwd ? "text" : "password"}
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="border p-2 w-full rounded-lg pr-10"
            placeholder="New Password"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500"
            onClick={() => setShowPwd(!showPwd)}
          >
            {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showCpwd ? "text" : "password"}
            value={cpwd}
            onChange={(e) => setCpwd(e.target.value)}
            className="border p-2 w-full rounded-lg pr-10"
            placeholder="Confirm Password"
          />
          <button
            type="button"
            className="absolute right-3 top-2.5 text-gray-500"
            onClick={() => setShowCpwd(!showCpwd)}
          >
            {showCpwd ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </DialogContent>
    </Dialog>
  );
}

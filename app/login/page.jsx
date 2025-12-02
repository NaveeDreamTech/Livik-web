"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import OtpModal from "./components/OtpModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import SuccessModal from "./components/SuccessModal";
import Image from "next/image";

export default function LoginPage() {
  const [step, setStep] = useState("");
  const router = useRouter(); // ✅ FIXED

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative">
      <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
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

        <div className="w-full shadow-lg rounded-xl p-6 bg-[#1E1E1E]/30">
          <h1 className="text-2xl font-bold text-center mb-6 text-white">
            Login
          </h1>

          <LoginForm
            onForgot={() => setStep("forgot")}
            onLoginWithMobile={() => setStep("forgot")}
            onSuccess={() => {
              console.log("Redirecting...");
              router.push("/dashboard");
            }}
          />
        </div>
      </div>

      {/* Forgot Modal */}
      <ForgotPasswordModal
        open={step === "forgot"}
        onClose={(next) => {
          if (next === "otp") setStep("otp");
          else setStep("");
        }}
      />

      {/* OTP */}
      <OtpModal
        open={step === "otp"}
        onClose={(next) => {
          if (next === "reset") setStep("reset");
          else if (next === "dashboard") {
            router.push("/dashboard");
            setStep("");
          } else setStep("");
        }}
        onPasswordExists={(user) => {
          // Password exists, route to dashboard
          console.log("Password exists, routing to dashboard");
          router.push("/dashboard");
          setStep("");
        }}
        onPasswordNotExists={() => {
          // Password doesn't exist, open reset password modal
          console.log("Password doesn't exist, opening reset password modal");
          setStep("reset");
        }}
      />

      {/* Reset Password */}
      <ResetPasswordModal
        open={step === "reset"}
        onClose={(next) => {
          if (next === "success") setStep("success");
          else setStep("");
        }}
      />

      {/* Success */}
      <SuccessModal open={step === "success"} onClose={() => setStep("")} />
    </div>
  );
}

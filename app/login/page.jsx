// "use client";

// import React, { useEffect, useRef, useState, useTransition } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { auth } from "../../lib/firebaseClient";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// /* -------------------------
//    Styled Input & Button matching the login form design
//    ------------------------- */
// function StyledInput({
//   className = "",
//   type = "text",
//   value,
//   onChange,
//   placeholder,
//   name,
//   ...rest
// }) {
//   return (
//     <input
//       type={type}
//       name={name}
//       value={value}
//       onChange={onChange}
//       placeholder={placeholder}
//       className={`w-full px-5 py-3.5 text-[15px] border-none rounded-lg bg-[#f5f5f5] text-[#333333] outline-none transition-all duration-300 placeholder:text-[#999] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,144,255,0.2)] ${className}`}
//       {...rest}
//     />
//   );
// }

// function StyledButton({
//   type = "button",
//   disabled = false,
//   onClick,
//   children,
//   className = "",
// }) {
//   return (
//     <button
//       type={type}
//       disabled={disabled}
//       onClick={onClick}
//       className={`w-full px-6 py-3.5 text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 outline-none bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873cc] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2 ${className}`}
//     >
//       {children}
//     </button>
//   );
// }

// /* -------------------------
//    OTP components (no libs)
//    - InputOTP: controlled (value, onChange, maxLength)
//    - InputOTPGroup: layout wrapper
//    - InputOTPSlot: single visual slot (reads from context)
//    - InputOTPSeparator: simple separator element (dot)
//    ------------------------- */

// const OTPInputContext = React.createContext(null);

// function InputOTP({
//   value = "",
//   onChange = () => {},
//   maxLength = 6,
//   className = "",
//   containerClassName = "",
//   children,
//   ...rest
// }) {
//   const inputRef = useRef(null);
//   const containerRef = useRef(null);
//   const [focusIndex, setFocusIndex] = useState(0);

//   const v = (value || "").slice(0, maxLength);

//   const slots = Array.from({ length: maxLength }).map((_, idx) => {
//     const char = v[idx] || "";
//     const isActive = focusIndex === idx;
//     const hasFakeCaret = isActive && char === "";
//     return { char, isActive, hasFakeCaret };
//   });

//   useEffect(() => {
//     const container = containerRef.current;
//     if (!container) return;
//     const onClick = () => {
//       const firstEmpty = v.length < maxLength ? v.length : maxLength - 1;
//       setFocusIndex(firstEmpty);
//       if (inputRef.current) inputRef.current.focus();
//     };
//     container.addEventListener("click", onClick);
//     return () => container.removeEventListener("click", onClick);
//   }, [v, maxLength]);

//   const handleKeyDown = (e) => {
//     const key = e.key;

//     if (key === "ArrowLeft") {
//       e.preventDefault();
//       setFocusIndex((i) => Math.max(0, i - 1));
//       return;
//     }
//     if (key === "ArrowRight") {
//       e.preventDefault();
//       setFocusIndex((i) => Math.min(maxLength - 1, i + 1));
//       return;
//     }

//     if (key === "Backspace") {
//       e.preventDefault();
//       if (v[focusIndex]) {
//         const arr = v.split("");
//         arr[focusIndex] = "";
//         onChange(arr.join(""));
//         return;
//       }
//       if (focusIndex > 0) {
//         const prev = focusIndex - 1;
//         const arr = v.split("");
//         arr.splice(prev, 1);
//         onChange(arr.join(""));
//         setFocusIndex(prev);
//       }
//       return;
//     }

//     if (key === "Delete") {
//       e.preventDefault();
//       if (v[focusIndex]) {
//         const arr = v.split("");
//         arr.splice(focusIndex, 1);
//         onChange(arr.join(""));
//       }
//       return;
//     }

//     if (/^[0-9]$/.test(key)) {
//       e.preventDefault();
//       const arr = v.split("");
//       arr[focusIndex] = key;
//       const newVal = (() => {
//         while (arr.length < focusIndex + 1) arr.push("");
//         return arr.join("").slice(0, maxLength);
//       })();
//       onChange(newVal);
//       setFocusIndex((i) => Math.min(maxLength - 1, i + 1));
//       return;
//     }

//     if (key === "Tab") return;

//     e.preventDefault();
//   };

//   const handlePaste = (e) => {
//     e.preventDefault();
//     const paste = (e.clipboardData || window.clipboardData).getData("text");
//     const digits = paste.replace(/\D/g, "");
//     if (!digits) return;
//     const arr = v.split("");
//     let idx = focusIndex;
//     for (let i = 0; i < digits.length && idx < maxLength; i++, idx++) {
//       arr[idx] = digits[i];
//     }
//     const newVal = arr.join("").slice(0, maxLength);
//     onChange(newVal);
//     const nextFocus = Math.min(maxLength - 1, focusIndex + digits.length);
//     setFocusIndex(nextFocus);
//   };

//   return (
//     <OTPInputContext.Provider
//       value={{
//         slots,
//         focusIndex,
//         setFocusIndex,
//       }}
//     >
//       <div
//         ref={containerRef}
//         className={`relative ${containerClassName}`}
//         {...rest}
//       >
//         <input
//           ref={inputRef}
//           type="tel"
//           inputMode="numeric"
//           autoComplete="one-time-code"
//           value=""
//           onChange={() => {}}
//           onKeyDown={handleKeyDown}
//           onPaste={handlePaste}
//           className="absolute inset-0 w-full h-full opacity-0 z-10"
//           aria-hidden="true"
//         />
//         <div className={`flex items-center gap-2 ${className}`}>{children}</div>
//       </div>
//     </OTPInputContext.Provider>
//   );
// }

// function InputOTPGroup({ children, className = "", ...rest }) {
//   return (
//     <div className={`flex items-center ${className}`} {...rest}>
//       {children}
//     </div>
//   );
// }

// function InputOTPSlot({ index = 0, className = "", ...rest }) {
//   const ctx = React.useContext(OTPInputContext);
//   if (!ctx) return null;
//   const slot = ctx.slots[index] || {
//     char: "",
//     isActive: false,
//     hasFakeCaret: false,
//   };
//   const { char, isActive, hasFakeCaret } = slot;

//   return (
//     <div
//       role="presentation"
//       className={`relative flex h-10 w-10 items-center justify-center border-y border-r border-gray-300 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md bg-white ${
//         isActive ? "z-10 ring-2 ring-blue-400" : ""
//       } ${className}`}
//       {...rest}
//     >
//       <span>{char}</span>
//       {hasFakeCaret && (
//         <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//           <div className="h-4 w-px animate-pulse bg-black duration-1000" />
//         </div>
//       )}
//     </div>
//   );
// }

// function InputOTPSeparator(props) {
//   return (
//     <div role="separator" aria-hidden="true" className="px-1" {...props}>
//       <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
//         <circle cx="12" cy="12" r="3" fill="currentColor" />
//       </svg>
//     </div>
//   );
// }

// /* -------------------------
//    OtpLogin (mobile) implementation
//    - phone input and send button styled like main login form
//    - OTP UI kept the same
//    - on success redirect to /dashboard
//    ------------------------- */

// function OtpLogin({ onVerifiedRedirectTo = "/dashboard", onBack }) {
//   const router = useRouter();

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState("");
//   const [resendCountdown, setResendCountdown] = useState(0);

//   const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
//   const [confirmationResult, setConfirmationResult] = useState(null);

//   const [isPending, startTransition] = useTransition();

//   useEffect(() => {
//     let timer;
//     if (resendCountdown > 0) {
//       timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
//     }
//     return () => clearTimeout(timer);
//   }, [resendCountdown]);

//   useEffect(() => {
//     const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
//       size: "invisible",
//     });

//     setRecaptchaVerifier(recaptcha);

//     return () => {
//       try {
//         recaptcha.clear();
//       } catch (e) {
//         // ignore
//       }
//     };
//   }, [auth]);

//   useEffect(() => {
//     if (otp.length === 6) {
//       verifyOtp();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [otp]);

//   const verifyOtp = async () => {
//     startTransition(async () => {
//       setError("");

//       if (!confirmationResult) {
//         setError("Please request OTP first.");
//         return;
//       }

//       try {
//         await confirmationResult.confirm(otp);
//         router.replace(onVerifiedRedirectTo);
//       } catch (err) {
//         console.log(err);
//         setError("Failed to verify OTP. Please check the OTP.");
//       }
//     });
//   };

//   const requestOtp = async (e) => {
//     if (e && typeof e.preventDefault === "function") e.preventDefault();

//     setResendCountdown(60);

//     startTransition(async () => {
//       setError("");

//       if (!recaptchaVerifier) {
//         return setError("RecaptchaVerifier is not initialized.");
//       }

//       try {
//         const confirmation = await signInWithPhoneNumber(
//           auth,
//           phoneNumber,
//           recaptchaVerifier
//         );

//         setConfirmationResult(confirmation);
//         setSuccess("OTP sent successfully.");
//       } catch (err) {
//         console.log(err);
//         setResendCountdown(0);

//         if (err && err.code === "auth/invalid-phone-number") {
//           setError("Invalid phone number. Please check the number.");
//         } else if (err && err.code === "auth/too-many-requests") {
//           setError("Too many requests. Please try again later.");
//         } else {
//           setError("Failed to send OTP. Please try again.");
//         }
//       }
//     });
//   };

//   const loadingIndicator = (
//     <div role="status" className="flex justify-center">
//       <svg
//         aria-hidden="true"
//         className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
//         viewBox="0 0 100 101"
//         fill="none"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path
//           d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//           fill="currentColor"
//         />
//         <path
//           d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//           fill="currentFill"
//         />
//       </svg>
//       <span className="sr-only">Loading...</span>
//     </div>
//   );

//   return (
//     <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
//       <div className="mb-2 text-left">
//         <button
//           type="button"
//           className="text-sm text-[#1E90FF] underline"
//           onClick={onBack}
//         >
//           &larr; Back to password login
//         </button>
//       </div>

//       {!confirmationResult && (
//         <form onSubmit={requestOtp} className="flex flex-col gap-4">
//           <div className="relative">
//             <StyledInput
//               type="tel"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//               placeholder="+91..."
//               name="phone"
//               required
//               aria-label="Phone number"
//             />
//           </div>

//           <StyledButton
//             type="button"
//             onClick={() => requestOtp()}
//             disabled={!phoneNumber || isPending || resendCountdown > 0}
//           >
//             {resendCountdown > 0
//               ? `Resend OTP in ${resendCountdown}`
//               : isPending
//               ? "Sending OTP"
//               : "Send OTP"}
//           </StyledButton>

//           <div className="p-6 text-center w-full max-w-sm">
//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}
//           </div>
//         </form>
//       )}

//       {confirmationResult && (
//         <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
//           <div className="mt-4 w-full max-w-sm">
//             <InputOTP
//               maxLength={6}
//               value={otp}
//               onChange={(val) => setOtp(val)}
//               containerClassName="w-full"
//               className="justify-center"
//             >
//               <InputOTPGroup>
//                 <InputOTPSlot index={0} />
//                 <InputOTPSlot index={1} />
//                 <InputOTPSlot index={2} />
//               </InputOTPGroup>

//               <InputOTPSeparator />

//               <InputOTPGroup>
//                 <InputOTPSlot index={3} />
//                 <InputOTPSlot index={4} />
//                 <InputOTPSlot index={5} />
//               </InputOTPGroup>
//             </InputOTP>
//           </div>

//           <div className="w-full max-w-sm mt-5">
//             <StyledButton
//               type="button"
//               onClick={() => requestOtp()}
//               disabled={!phoneNumber || isPending || resendCountdown > 0}
//             >
//               {resendCountdown > 0
//                 ? `Resend OTP in ${resendCountdown}`
//                 : isPending
//                 ? "Sending OTP"
//                 : "Send OTP"}
//             </StyledButton>
//           </div>

//           <div className="p-6 text-center w-full max-w-sm">
//             {error && <p className="text-red-500">{error}</p>}
//             {success && <p className="text-green-500">{success}</p>}
//           </div>
//         </div>
//       )}

//       <div id="recaptcha-container" />

//       {isPending && loadingIndicator}
//     </div>
//   );
// }

// /* -------------------------
//    Main Login Page
//    ------------------------- */

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const [showMobileLogin, setShowMobileLogin] = useState(false);

//   const [isPending, startTransition] = useTransition();

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((s) => ({ ...s, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // keep as no-op per instruction
//     console.log("submit", formData);
//   };

//   return (
//     <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
//       {/* Logo Container */}
//       <div className="mb-6">
//         <div className="w-[120px] h-[120px] rounded-full inline-flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.2)] mb-4 overflow-hidden bg-white">
//           <Image
//             src="/asset/livik-logo.png"
//             alt="Livik Logo"
//             width={85}
//             height={85}
//             className="object-contain"
//             priority
//           />
//         </div>
//       </div>

//       {!showMobileLogin ? (
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
//           <div className="relative">
//             <StyledInput
//               type="text"
//               placeholder="Username or Email"
//               name="username"
//               value={formData.username}
//               onChange={handleFormChange}
//               required
//               autoComplete="username"
//               aria-label="Username or Email"
//             />
//           </div>

//           <div className="relative">
//             <StyledInput
//               type="password"
//               placeholder="Password"
//               name="password"
//               value={formData.password}
//               onChange={handleFormChange}
//               required
//               autoComplete="current-password"
//               aria-label="Password"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full px-6 py-3.5 text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 outline-none bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873cc] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2 mt-2"
//           >
//             Login
//           </button>

//           <div className="flex items-center justify-between mt-1">
//             <button
//               type="button"
//               className="text-[14px] font-medium cursor-pointer transition-all duration-300 outline-none text-[#1E90FF] hover:text-[#5eb8ff] underline focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2"
//               onClick={() => {
//                 // placeholder
//                 console.log("Forgot Password clicked");
//               }}
//             >
//               Forgot Password?
//             </button>

//             <button
//               type="button"
//               className="text-[14px] font-medium cursor-pointer transition-all duration-300 outline-none text-[#1E90FF] hover:text-[#5eb8ff] underline focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2"
//               onClick={() => {
//                 startTransition(() => {
//                   setShowMobileLogin(true);
//                 });
//               }}
//             >
//               Login With Mobile
//             </button>
//           </div>
//         </form>
//       ) : (
//         <OtpLogin
//           onVerifiedRedirectTo="/dashboard"
//           onBack={() => setShowMobileLogin(false)}
//         />
//       )}
//     </div>
//   );
// }

"use client";

import React, { useEffect, useRef, useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { auth } from "../../lib/firebaseClient";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

/* -------------------------
   Styled Input & Button matching the login form design
   ------------------------- */
function StyledInput({
  className = "",
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  ...rest
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-5 py-3.5 text-[15px] border-none rounded-lg bg-[#f5f5f5] text-[#333333] outline-none transition-all duration-300 placeholder:text-[#999] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,144,255,0.2)] ${className}`}
      {...rest}
    />
  );
}

function StyledButton({
  type = "button",
  disabled = false,
  onClick,
  children,
  className = "",
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`w-full px-6 py-3.5 text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 outline-none bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873cc] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}

/* -------------------------
   OTP components (no libs)
   - InputOTP: controlled (value, onChange, maxLength)
   - InputOTPGroup: layout wrapper
   - InputOTPSlot: single visual slot (reads from context)
   - InputOTPSeparator: simple separator element (dot)
   ------------------------- */

const OTPInputContext = React.createContext(null);

function InputOTP({
  value = "",
  onChange = () => {},
  maxLength = 6,
  className = "",
  containerClassName = "",
  children,
  ...rest
}) {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const v = (value || "").slice(0, maxLength);

  const slots = Array.from({ length: maxLength }).map((_, idx) => {
    const char = v[idx] || "";
    const isActive = focusIndex === idx;
    const hasFakeCaret = isActive && char === "";
    return { char, isActive, hasFakeCaret };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const onClick = () => {
      const firstEmpty = v.length < maxLength ? v.length : maxLength - 1;
      setFocusIndex(firstEmpty);
      if (inputRef.current) inputRef.current.focus();
    };
    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [v, maxLength]);

  const handleKeyDown = (e) => {
    const key = e.key;

    if (key === "ArrowLeft") {
      e.preventDefault();
      setFocusIndex((i) => Math.max(0, i - 1));
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      setFocusIndex((i) => Math.min(maxLength - 1, i + 1));
      return;
    }

    if (key === "Backspace") {
      e.preventDefault();
      if (v[focusIndex]) {
        const arr = v.split("");
        arr[focusIndex] = "";
        onChange(arr.join(""));
        return;
      }
      if (focusIndex > 0) {
        const prev = focusIndex - 1;
        const arr = v.split("");
        arr.splice(prev, 1);
        onChange(arr.join(""));
        setFocusIndex(prev);
      }
      return;
    }

    if (key === "Delete") {
      e.preventDefault();
      if (v[focusIndex]) {
        const arr = v.split("");
        arr.splice(focusIndex, 1);
        onChange(arr.join(""));
      }
      return;
    }

    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      const arr = v.split("");
      arr[focusIndex] = key;
      const newVal = (() => {
        while (arr.length < focusIndex + 1) arr.push("");
        return arr.join("").slice(0, maxLength);
      })();
      onChange(newVal);
      setFocusIndex((i) => Math.min(maxLength - 1, i + 1));
      return;
    }

    if (key === "Tab") return;

    e.preventDefault();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData || window.clipboardData).getData("text");
    const digits = paste.replace(/\D/g, "");
    if (!digits) return;
    const arr = v.split("");
    let idx = focusIndex;
    for (let i = 0; i < digits.length && idx < maxLength; i++, idx++) {
      arr[idx] = digits[i];
    }
    const newVal = arr.join("").slice(0, maxLength);
    onChange(newVal);
    const nextFocus = Math.min(maxLength - 1, focusIndex + digits.length);
    setFocusIndex(nextFocus);
  };

  return (
    <OTPInputContext.Provider
      value={{
        slots,
        focusIndex,
        setFocusIndex,
      }}
    >
      <div
        ref={containerRef}
        className={`relative ${containerClassName}`}
        {...rest}
      >
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          autoComplete="one-time-code"
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="absolute inset-0 w-full h-full opacity-0 z-10"
          aria-hidden="true"
        />
        <div className={`flex items-center gap-2 ${className}`}>{children}</div>
      </div>
    </OTPInputContext.Provider>
  );
}

function InputOTPGroup({ children, className = "", ...rest }) {
  return (
    <div className={`flex items-center ${className}`} {...rest}>
      {children}
    </div>
  );
}

function InputOTPSlot({ index = 0, className = "", ...rest }) {
  const ctx = React.useContext(OTPInputContext);
  if (!ctx) return null;
  const slot = ctx.slots[index] || {
    char: "",
    isActive: false,
    hasFakeCaret: false,
  };
  const { char, isActive, hasFakeCaret } = slot;

  return (
    <div
      role="presentation"
      className={`relative flex h-10 w-10 items-center justify-center border-y border-r border-gray-300 text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md bg-white ${
        isActive ? "z-10 ring-2 ring-blue-400" : ""
      } ${className}`}
      {...rest}
    >
      <span>{char}</span>
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="h-4 w-px animate-pulse bg-black duration-1000" />
        </div>
      )}
    </div>
  );
}

function InputOTPSeparator(props) {
  return (
    <div role="separator" aria-hidden="true" className="px-1" {...props}>
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}

/* -------------------------
   OtpLogin (mobile) implementation
   - phone input and send button styled like main login form
   - OTP UI kept the same
   - on success redirect to /dashboard
   - sets a cookie named `token` with the ID token (so middleware can read it)
   ------------------------- */

function OtpLogin({ onVerifiedRedirectTo = "/dashboard", onBack }) {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    const recaptcha = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });

    setRecaptchaVerifier(recaptcha);

    return () => {
      try {
        recaptcha.clear();
      } catch (e) {
        // ignore
      }
    };
  }, [auth]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);

  const verifyOtp = async () => {
    startTransition(async () => {
      setError("");

      if (!confirmationResult) {
        setError("Please request OTP first.");
        return;
      }

      try {
        // Confirm the OTP and capture the returned UserCredential
        const userCredential = await confirmationResult.confirm(otp);

        // Obtain fresh ID token from the authenticated user
        const idToken = await userCredential.user.getIdToken(true);

        // Set a cookie named `token` that middleware will read.
        // Note: this is a non-httpOnly cookie so middleware can access it.
        // For production consider creating httpOnly session cookies via Firebase Admin instead.
        // Set cookie expiry to 1 hour (3600 seconds)
        document.cookie = `token=${idToken}; path=/; max-age=3600;`;

        // Redirect to dashboard
        router.replace(onVerifiedRedirectTo);
      } catch (err) {
        console.log(err);
        setError("Failed to verify OTP. Please check the OTP.");
      }
    });
  };

  const requestOtp = async (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();

    setResendCountdown(60);

    startTransition(async () => {
      setError("");

      if (!recaptchaVerifier) {
        return setError("RecaptchaVerifier is not initialized.");
      }

      try {
        const confirmation = await signInWithPhoneNumber(
          auth,
          phoneNumber,
          recaptchaVerifier
        );

        setConfirmationResult(confirmation);
        setSuccess("OTP sent successfully.");
      } catch (err) {
        console.log(err);
        setResendCountdown(0);

        if (err && err.code === "auth/invalid-phone-number") {
          setError("Invalid phone number. Please check the number.");
        } else if (err && err.code === "auth/too-many-requests") {
          setError("Too many requests. Please try again later.");
        } else {
          setError("Failed to send OTP. Please try again.");
        }
      }
    });
  };

  const loadingIndicator = (
    <div role="status" className="flex justify-center">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
    <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
      <div className="mb-2 text-left">
        <button
          type="button"
          className="text-sm text-[#1E90FF] underline"
          onClick={onBack}
        >
          &larr; Back to password login
        </button>
      </div>

      {!confirmationResult && (
        <form onSubmit={requestOtp} className="flex flex-col gap-4">
          <div className="relative">
            <StyledInput
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="+91..."
              name="phone"
              required
              aria-label="Phone number"
            />
          </div>

          <StyledButton
            type="button"
            onClick={() => requestOtp()}
            disabled={!phoneNumber || isPending || resendCountdown > 0}
          >
            {resendCountdown > 0
              ? `Resend OTP in ${resendCountdown}`
              : isPending
              ? "Sending OTP"
              : "Send OTP"}
          </StyledButton>

          <div className="p-6 text-center w-full max-w-sm">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </form>
      )}

      {confirmationResult && (
        <div className="w-full max-w-[450px] text-center animate-fadeIn px-5">
          <div className="mt-4 w-full max-w-sm">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(val) => setOtp(val)}
              containerClassName="w-full"
              className="justify-center"
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>

              <InputOTPSeparator />

              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="w-full max-w-sm mt-5">
            <StyledButton
              type="button"
              onClick={() => requestOtp()}
              disabled={!phoneNumber || isPending || resendCountdown > 0}
            >
              {resendCountdown > 0
                ? `Resend OTP in ${resendCountdown}`
                : isPending
                ? "Sending OTP"
                : "Send OTP"}
            </StyledButton>
          </div>

          <div className="p-6 text-center w-full max-w-sm">
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </div>
      )}

      <div id="recaptcha-container" />

      {isPending && loadingIndicator}
    </div>
  );
}

/* -------------------------
   Main Login Page
   ------------------------- */

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showMobileLogin, setShowMobileLogin] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // keep as no-op per instruction
    console.log("submit", formData);
  };

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

      {!showMobileLogin ? (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="relative">
            <StyledInput
              type="text"
              placeholder="Username or Email"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              required
              autoComplete="username"
              aria-label="Username or Email"
            />
          </div>

          <div className="relative">
            <StyledInput
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              required
              autoComplete="current-password"
              aria-label="Password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3.5 text-[15px] font-semibold border-none cursor-pointer transition-all duration-300 outline-none bg-[#1E90FF] text-white rounded-lg hover:bg-[#1873cc] hover:-translate-y-[1px] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2 mt-2"
          >
            Login
          </button>

          <div className="flex items-center justify-between mt-1">
            <button
              type="button"
              className="text-[14px] font-medium cursor-pointer transition-all duration-300 outline-none text-[#1E90FF] hover:text-[#5eb8ff] underline focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2"
              onClick={() => {
                // placeholder
                console.log("Forgot Password clicked");
              }}
            >
              Forgot Password?
            </button>

            <button
              type="button"
              className="text-[14px] font-medium cursor-pointer transition-all duration-300 outline-none text-[#1E90FF] hover:text-[#5eb8ff] underline focus-visible:outline-2 focus-visible:outline-[#1E90FF] focus-visible:outline-offset-2"
              onClick={() => {
                startTransition(() => {
                  setShowMobileLogin(true);
                });
              }}
            >
              Login With Mobile
            </button>
          </div>
        </form>
      ) : (
        <OtpLogin
          onVerifiedRedirectTo="/dashboard"
          onBack={() => setShowMobileLogin(false)}
        />
      )}
    </div>
  );
}

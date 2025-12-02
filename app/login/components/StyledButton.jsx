"use client";

export default function StyledButton({
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

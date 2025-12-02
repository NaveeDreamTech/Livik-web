"use client";

export default function StyledInput({
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

// // components/EmployeeForm/EmployeeForm.jsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { generateTempPass } from "../../../utils/generateTempPass";
// import BasicInfo from "./sections/BasicInfo";
// import AddressSection from "./sections/AddressSection";
// import EducationSection from "./sections/EducationSection";
// import EmploymentBankSection from "./sections/EmploymentBankSection";
// import ReviewSection from "./sections/ReviewSection";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
// const aadhaarRegex = /^\d{12}$/;
// const phoneRegex = /^\d{10,14}$/;
// const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
// const accountRegex = /^[0-9]{6,20}$/;

// function toISODateIfValid(v) {
//   if (!v) return null;
//   if (v instanceof Date) return v.toISOString();
//   const s = String(v).trim();
//   if (s === "") return null;
//   const needsTime = !/T|\+|\-/.test(s);
//   const iso = needsTime ? `${s}T00:00:00.000Z` : s;
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return null;
//   return d.toISOString();
// }

// export default function EmployeeForm({
//   mode = "create",
//   initialData = {},
//   onCancel,
//   onSubmit,
// }) {
//   const isView = mode === "view";
//   const isEdit = mode === "edit";

//   const steps = [
//     "Basic Info",
//     "Address",
//     "Education",
//     "Employment & Bank",
//     "Review",
//   ];
//   const [step, setStep] = useState(0);

//   const [form, setForm] = useState({
//     empId: initialData.empId ?? "",
//     firstName: initialData.firstName ?? "",
//     lastName: initialData.lastName ?? "",
//     dateOfBirth:
//       initialData.dateOfBirth && !isNaN(Date.parse(initialData.dateOfBirth))
//         ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
//         : "",
//     gender: initialData.gender ?? "",
//     aadhaarNumber: initialData.aadhaarNumber ?? "",
//     panNumber: initialData.panNumber ?? "",
//     email: initialData.email ?? "",
//     phoneNumber: initialData.phoneNumber ?? "",
//     emergencyContact: initialData.emergencyContact ?? "",
//     photo: initialData.photo ?? "",
//     bloodGroup: initialData.bloodGroup ?? "",
//     presentAddress: initialData.presentAddress ?? "",
//     permanentAddress: initialData.permanentAddress ?? "",
//     designation: initialData.designation ?? "",
//     department: initialData.department ?? "",
//     dateOfJoining:
//       initialData.dateOfJoining && !isNaN(Date.parse(initialData.dateOfJoining))
//         ? new Date(initialData.dateOfJoining).toISOString().slice(0, 10)
//         : "",
//     workLocation: initialData.workLocation ?? "",
//     bankName: initialData.bankName ?? "",
//     accountNumber: initialData.accountNumber ?? "",
//     ifscCode: initialData.ifscCode ?? "",
//   });

//   const [educations, setEducations] = useState(
//     (initialData.educationDetails || initialData.education || []).length
//       ? (initialData.educationDetails || initialData.education || []).map(
//           (e) => ({
//             university: e.university ?? "",
//             institution: e.institution ?? "",
//             qualification: e.qualification ?? "",
//             yearCompleted: e.yearCompleted ?? "",
//           })
//         )
//       : [
//           {
//             university: "",
//             institution: "",
//             qualification: "",
//             yearCompleted: "",
//           },
//         ]
//   );

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const [generateTemp, setGenerateTemp] = useState(true);
//   const [tempPasswordValue, setTempPasswordValue] = useState("");

//   useEffect(() => {
//     setErrors({});
//   }, [step]);

//   useEffect(() => {
//     if (!generateTemp) {
//       setTempPasswordValue("");
//     }
//   }, [generateTemp]);

//   const setField = (name, value) => {
//     setForm((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: undefined }));
//   };

//   const addEducation = () =>
//     setEducations((p) => [
//       ...p,
//       { university: "", institution: "", qualification: "", yearCompleted: "" },
//     ]);

//   const updateEducation = (idx, field, value) =>
//     setEducations((p) =>
//       p.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
//     );

//   const removeEducation = (idx) =>
//     setEducations((p) => p.filter((_, i) => i !== idx));

//   const validators = {
//     firstName: (v) => (!v || !v.trim() ? "First name is required." : null),
//     lastName: (v) => (!v || !v.trim() ? "Last name is required." : null),
//     email: (v) => (v && !emailRegex.test(v) ? "Invalid email." : null),
//     phoneNumber: (v) =>
//       v && !phoneRegex.test(v.replace(/\D/g, ""))
//         ? "Phone should be digits (10-14)."
//         : null,
//     aadhaarNumber: (v) =>
//       v && !aadhaarRegex.test(v) ? "Aadhaar must be 12 digits." : null,
//     panNumber: (v) =>
//       v && !panRegex.test(v) ? "PAN format invalid (e.g. ABCDE1234F)." : null,
//     ifscCode: (v) => (v && !ifscRegex.test(v) ? "IFSC invalid." : null),
//     accountNumber: (v) =>
//       v && !accountRegex.test(v) ? "Account number seems invalid." : null,
//     dateOfBirth: (v) => {
//       if (!v) return null;
//       const d = new Date(v);
//       if (Number.isNaN(d.getTime())) return "Invalid date.";
//       if (d > new Date()) return "DOB can't be in the future.";
//       return null;
//     },
//     dateOfJoining: (v) => {
//       if (!v) return null;
//       const d = new Date(v);
//       if (Number.isNaN(d.getTime())) return "Invalid date.";
//       return null;
//     },
//   };

//   const validateStep = (s = step) => {
//     const newErrors = {};
//     if (s === 0) {
//       [
//         "firstName",
//         "lastName",
//         "email",
//         "phoneNumber",
//         "aadhaarNumber",
//         "panNumber",
//         "dateOfBirth",
//       ].forEach((k) => {
//         const msg = validators[k]?.(form[k]);
//         if (msg) newErrors[k] = msg;
//       });
//     } else if (s === 1) {
//       if (!form.presentAddress || !form.presentAddress.trim())
//         newErrors.presentAddress = "Present address is required.";
//     } else if (s === 2) {
//       const hasValid = educations.some(
//         (e) =>
//           e.institution &&
//           e.institution.trim() &&
//           e.qualification &&
//           e.qualification.trim()
//       );
//       // education is optional on creation per your request — preserve original behaviour:
//       // (previously you said education optional while adding; so we only enforce when any edu exists)
//       // keep same logic as original (it enforced at least one valid). We'll keep that.
//       if (!hasValid)
//         newErrors.educations =
//           "Add at least one education record (institution + qualification).";
//       educations.forEach((e, i) => {
//         if (
//           e.yearCompleted &&
//           !/^\d{4}$/.test(String(e.yearCompleted).trim())
//         ) {
//           (newErrors.education_years = newErrors.education_years || {})[i] =
//             "Enter 4-digit year (e.g. 2020)";
//         }
//       });
//     } else if (s === 3) {
//       const ifscMsg = validators.ifscCode(form.ifscCode);
//       if (ifscMsg) newErrors.ifscCode = ifscMsg;
//       const accMsg = validators.accountNumber(form.accountNumber);
//       if (accMsg) newErrors.accountNumber = accMsg;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const goNext = () => {
//     const ok = validateStep(step);
//     if (!ok) return;

//     const nextStep = Math.min(steps.length - 1, step + 1);

//     if (
//       !isView &&
//       nextStep === steps.length - 1 &&
//       generateTemp &&
//       !tempPasswordValue
//     ) {
//       try {
//         const tmp = generateTempPass(12);
//         setTempPasswordValue(tmp);
//       } catch (e) {
//         setTempPasswordValue(
//           Math.random().toString(36).slice(2, 14).toUpperCase()
//         );
//       }
//     }

//     setStep(nextStep);
//   };

//   const goPrev = () => {
//     setStep((s) => Math.max(0, s - 1));
//   };

//   const inputProps = (name, type = "text", opts = {}) => ({
//     name,
//     value: form[name] ?? "",
//     onChange: (e) => setField(name, e.target.value),
//     type,
//     readOnly: isView,
//     disabled: isView,
//     className:
//       "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400",
//     ...opts,
//   });

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     if (isView) {
//       onCancel?.();
//       return;
//     }

//     for (let i = 0; i < steps.length - 1; i++) {
//       const ok = validateStep(i);
//       if (!ok) {
//         setStep(i);
//         return;
//       }
//     }

//     const payload = {
//       empId: form.empId || undefined,
//       firstName: form.firstName?.trim() || undefined,
//       lastName: form.lastName?.trim() || undefined,
//       dateOfBirth: toISODateIfValid(form.dateOfBirth),
//       gender: form.gender || undefined,
//       aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
//       panNumber: form.panNumber?.trim() || undefined,
//       email: form.email?.trim() || undefined,
//       phoneNumber: form.phoneNumber?.replace(/\D/g, "") || undefined,
//       emergencyContact: form.emergencyContact?.trim() || undefined,
//       photo: form.photo || undefined,
//       bloodGroup: form.bloodGroup ?? undefined,
//       presentAddress: form.presentAddress?.trim() || undefined,
//       permanentAddress: form.permanentAddress?.trim() || undefined,
//       designation: form.designation?.trim() || undefined,
//       department: form.department?.trim() || undefined,
//       dateOfJoining: toISODateIfValid(form.dateOfJoining),
//       workLocation: form.workLocation?.trim() || undefined,
//       bankName: form.bankName?.trim() || undefined,
//       accountNumber: form.accountNumber?.trim() || undefined,
//       ifscCode: form.ifscCode?.trim() || undefined,
//       education: educations
//         .filter(
//           (e) =>
//             (e.institution && e.institution.trim()) ||
//             (e.qualification && e.qualification.trim())
//         )
//         .map((e) => ({
//           university: e.university?.trim() || undefined,
//           institution: e.institution?.trim() || undefined,
//           qualification: e.qualification?.trim() || undefined,
//           yearCompleted: e.yearCompleted?.toString().trim() || undefined,
//         })),
//       generateTemp: !!generateTemp,
//       tempPassword: generateTemp ? tempPasswordValue || undefined : undefined,
//     };

//     if (!payload.firstName || !payload.lastName) {
//       setErrors({
//         firstName: "First name required.",
//         lastName: "Last name required.",
//       });
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const result = await Promise.resolve(onSubmit ? onSubmit(payload) : null);
//       setTempPasswordValue("");
//       return result;
//     } catch (err) {
//       setErrors((p) => ({ ...p, submit: err?.message ?? "Submit failed" }));
//       throw err;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCopyTemp = async () => {
//     try {
//       if (!tempPasswordValue) return;
//       await navigator.clipboard.writeText(tempPasswordValue);
//       alert("Temp password copied to clipboard");
//     } catch (e) {
//       alert("Copy failed — please select and copy manually.");
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Step indicator */}
//         <div className="flex gap-3 overflow-auto pb-2">
//           {steps.map((s, i) => {
//             const active = i === step;
//             const done = i < step;
//             return (
//               <div
//                 key={s}
//                 onClick={() => setStep(i)}
//                 className={`flex items-center gap-2 cursor-pointer select-none ${
//                   active
//                     ? "text-blue-600"
//                     : done
//                     ? "text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center border ${
//                     active ? "bg-blue-100" : done ? "bg-green-100" : "bg-white"
//                   }`}
//                 >
//                   {done ? "✓" : i + 1}
//                 </div>
//                 <div className="text-sm font-semibold">{s}</div>
//               </div>
//             );
//           })}
//         </div>

//         <div>
//           {step === 0 && (
//             <BasicInfo
//               form={form}
//               inputProps={inputProps}
//               errors={errors}
//               setField={setField}
//               isView={isView}
//             />
//           )}

//           {step === 1 && (
//             <AddressSection
//               form={form}
//               setField={setField}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {step === 2 && (
//             <EducationSection
//               educations={educations}
//               addEducation={addEducation}
//               updateEducation={updateEducation}
//               removeEducation={removeEducation}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {step === 3 && (
//             <EmploymentBankSection
//               form={form}
//               setField={setField}
//               inputProps={inputProps}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {step === 4 && (
//             <ReviewSection
//               form={form}
//               educations={educations}
//               generateTemp={generateTemp}
//               setGenerateTemp={setGenerateTemp}
//               tempPasswordValue={tempPasswordValue}
//               handleCopyTemp={handleCopyTemp}
//               regenerate={() => setTempPasswordValue(generateTempPass(12))}
//             />
//           )}
//         </div>

//         {errors.submit && (
//           <div className="text-sm text-red-600">{errors.submit}</div>
//         )}

//         {/* navigation */}
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             {step > 0 && (
//               <button
//                 type="button"
//                 onClick={goPrev}
//                 className="px-4 py-2 rounded-md border hover:bg-gray-50"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 rounded-md border hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//             {step < steps.length - 1 && (
//               <button
//                 type="button"
//                 onClick={goNext}
//                 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             )}

//             {step === steps.length - 1 && !isView && (
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
//               >
//                 {submitting
//                   ? "Saving..."
//                   : isEdit
//                   ? "Save Changes"
//                   : "Create Employee"}
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }


// components/EmployeeForm/EmployeeForm.jsx
// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import { generateTempPass } from "../../../utils/generateTempPass";
// import BasicInfo from "./sections/BasicInfo";
// import AddressSection from "./sections/AddressSection";
// import EducationSection from "./sections/EducationSection";
// import EmploymentBankSection from "./sections/EmploymentBankSection";
// import ReviewSection from "./sections/ReviewSection";

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
// const aadhaarRegex = /^\d{12}$/;
// const phoneRegex = /^\d{10,14}$/;
// const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
// const accountRegex = /^[0-9]{6,20}$/;

// function toISODateIfValid(v) {
//   if (!v) return null;
//   if (v instanceof Date) return v.toISOString();
//   const s = String(v).trim();
//   if (s === "") return null;
//   const needsTime = !/T|\+|\-/.test(s);
//   const iso = needsTime ? `${s}T00:00:00.000Z` : s;
//   const d = new Date(iso);
//   if (Number.isNaN(d.getTime())) return null;
//   return d.toISOString();
// }

// export default function EmployeeForm({
//   mode = "create",
//   initialData = {},
//   onCancel,
//   onSubmit,
// }) {
//   const isView = mode === "view";
//   const isEdit = mode === "edit";

//   // base steps (review is included only for create/edit)
//   const baseSteps = [
//     "Basic Info",
//     "Address",
//     "Education",
//     "Employment & Bank",
//     "Review",
//   ];

//   // steps depend on mode: if view, drop the Review step
//   const steps = useMemo(() => (isView ? baseSteps.slice(0, 4) : baseSteps), [isView]);

//   const [step, setStep] = useState(0);

//   const [form, setForm] = useState({
//     empId: initialData.empId ?? "",
//     firstName: initialData.firstName ?? "",
//     lastName: initialData.lastName ?? "",
//     dateOfBirth:
//       initialData.dateOfBirth && !isNaN(Date.parse(initialData.dateOfBirth))
//         ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
//         : "",
//     gender: initialData.gender ?? "",
//     aadhaarNumber: initialData.aadhaarNumber ?? "",
//     panNumber: initialData.panNumber ?? "",
//     email: initialData.email ?? "",
//     phoneNumber: initialData.phoneNumber ?? "",
//     emergencyContact: initialData.emergencyContact ?? "",
//     photo: initialData.photo ?? "",
//     bloodGroup: initialData.bloodGroup ?? "",
//     presentAddress: initialData.presentAddress ?? "",
//     permanentAddress: initialData.permanentAddress ?? "",
//     designation: initialData.designation ?? "",
//     department: initialData.department ?? "",
//     dateOfJoining:
//       initialData.dateOfJoining && !isNaN(Date.parse(initialData.dateOfJoining))
//         ? new Date(initialData.dateOfJoining).toISOString().slice(0, 10)
//         : "",
//     workLocation: initialData.workLocation ?? "",
//     bankName: initialData.bankName ?? "",
//     accountNumber: initialData.accountNumber ?? "",
//     ifscCode: initialData.ifscCode ?? "",
//   });

//   const [educations, setEducations] = useState(
//     (initialData.educationDetails || initialData.education || []).length
//       ? (initialData.educationDetails || initialData.education || []).map(
//           (e) => ({
//             university: e.university ?? "",
//             institution: e.institution ?? "",
//             qualification: e.qualification ?? "",
//             yearCompleted: e.yearCompleted ?? "",
//           })
//         )
//       : [
//           {
//             university: "",
//             institution: "",
//             qualification: "",
//             yearCompleted: "",
//           },
//         ]
//   );

//   const [errors, setErrors] = useState({});
//   const [submitting, setSubmitting] = useState(false);

//   const [generateTemp, setGenerateTemp] = useState(true);
//   const [tempPasswordValue, setTempPasswordValue] = useState("");

//   useEffect(() => {
//     setErrors({});
//   }, [step]);

//   useEffect(() => {
//     if (!generateTemp) {
//       setTempPasswordValue("");
//     }
//   }, [generateTemp]);

//   const setField = (name, value) => {
//     setForm((p) => ({ ...p, [name]: value }));
//     setErrors((p) => ({ ...p, [name]: undefined }));
//   };

//   const addEducation = () =>
//     setEducations((p) => [
//       ...p,
//       { university: "", institution: "", qualification: "", yearCompleted: "" },
//     ]);

//   const updateEducation = (idx, field, value) =>
//     setEducations((p) =>
//       p.map((r, i) => (i === idx ? { ...r, [field]: value } : r))
//     );

//   const removeEducation = (idx) =>
//     setEducations((p) => p.filter((_, i) => i !== idx));

//   const validators = {
//     firstName: (v) => (!v || !v.trim() ? "First name is required." : null),
//     lastName: (v) => (!v || !v.trim() ? "Last name is required." : null),
//     email: (v) => (v && !emailRegex.test(v) ? "Invalid email." : null),
//     phoneNumber: (v) =>
//       v && !phoneRegex.test(v.replace(/\D/g, ""))
//         ? "Phone should be digits (10-14)."
//         : null,
//     aadhaarNumber: (v) =>
//       v && !aadhaarRegex.test(v) ? "Aadhaar must be 12 digits." : null,
//     panNumber: (v) =>
//       v && !panRegex.test(v) ? "PAN format invalid (e.g. ABCDE1234F)." : null,
//     ifscCode: (v) => (v && !ifscRegex.test(v) ? "IFSC invalid." : null),
//     accountNumber: (v) =>
//       v && !accountRegex.test(v) ? "Account number seems invalid." : null,
//     dateOfBirth: (v) => {
//       if (!v) return null;
//       const d = new Date(v);
//       if (Number.isNaN(d.getTime())) return "Invalid date.";
//       if (d > new Date()) return "DOB can't be in the future.";
//       return null;
//     },
//     dateOfJoining: (v) => {
//       if (!v) return null;
//       const d = new Date(v);
//       if (Number.isNaN(d.getTime())) return "Invalid date.";
//       return null;
//     },
//   };

//   const validateStep = (s = step) => {
//     const newErrors = {};
//     if (s === 0) {
//       [
//         "firstName",
//         "lastName",
//         "email",
//         "phoneNumber",
//         "aadhaarNumber",
//         "panNumber",
//         "dateOfBirth",
//       ].forEach((k) => {
//         const msg = validators[k]?.(form[k]);
//         if (msg) newErrors[k] = msg;
//       });
//     } else if (s === 1) {
//       if (!form.presentAddress || !form.presentAddress.trim())
//         newErrors.presentAddress = "Present address is required.";
//     } else if (s === 2) {
//       const hasValid = educations.some(
//         (e) =>
//           e.institution &&
//           e.institution.trim() &&
//           e.qualification &&
//           e.qualification.trim()
//       );
//       if (!hasValid)
//         newErrors.educations =
//           "Add at least one education record (institution + qualification).";
//       educations.forEach((e, i) => {
//         if (
//           e.yearCompleted &&
//           !/^\d{4}$/.test(String(e.yearCompleted).trim())
//         ) {
//           (newErrors.education_years = newErrors.education_years || {})[i] =
//             "Enter 4-digit year (e.g. 2020)";
//         }
//       });
//     } else if (s === 3) {
//       // Employment & Bank validations
//       const ifscMsg = validators.ifscCode(form.ifscCode);
//       if (ifscMsg) newErrors.ifscCode = ifscMsg;
//       const accMsg = validators.accountNumber(form.accountNumber);
//       if (accMsg) newErrors.accountNumber = accMsg;
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const goNext = () => {
//     const ok = validateStep(step);
//     if (!ok) return;

//     const nextStep = Math.min(steps.length - 1, step + 1);

//     // generate temp password if going to final review step (only for create/edit)
//     if (
//       !isView &&
//       nextStep === steps.length - 1 &&
//       generateTemp &&
//       !tempPasswordValue
//     ) {
//       try {
//         const tmp = generateTempPass(12);
//         setTempPasswordValue(tmp);
//       } catch (e) {
//         setTempPasswordValue(
//           Math.random().toString(36).slice(2, 14).toUpperCase()
//         );
//       }
//     }

//     setStep(nextStep);
//   };

//   const goPrev = () => {
//     setStep((s) => Math.max(0, s - 1));
//   };

//   const inputProps = (name, type = "text", opts = {}) => ({
//     name,
//     value: form[name] ?? "",
//     onChange: (e) => setField(name, e.target.value),
//     type,
//     readOnly: isView,
//     disabled: isView,
//     className:
//       "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400",
//     ...opts,
//   });

//   const handleSubmit = async (e) => {
//     e?.preventDefault();
//     if (isView) {
//       onCancel?.();
//       return;
//     }

//     // validate all required steps (except final Review is not validated here)
//     for (let i = 0; i < steps.length - 1; i++) {
//       const ok = validateStep(i);
//       if (!ok) {
//         setStep(i);
//         return;
//       }
//     }

//     const payload = {
//       empId: form.empId || undefined,
//       firstName: form.firstName?.trim() || undefined,
//       lastName: form.lastName?.trim() || undefined,
//       dateOfBirth: toISODateIfValid(form.dateOfBirth),
//       gender: form.gender || undefined,
//       aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
//       panNumber: form.panNumber?.trim() || undefined,
//       email: form.email?.trim() || undefined,
//       phoneNumber: form.phoneNumber?.replace(/\D/g, "") || undefined,
//       emergencyContact: form.emergencyContact?.trim() || undefined,
//       photo: form.photo || undefined,
//       bloodGroup: form.bloodGroup ?? undefined,
//       presentAddress: form.presentAddress?.trim() || undefined,
//       permanentAddress: form.permanentAddress?.trim() || undefined,
//       designation: form.designation?.trim() || undefined,
//       department: form.department?.trim() || undefined,
//       dateOfJoining: toISODateIfValid(form.dateOfJoining),
//       workLocation: form.workLocation?.trim() || undefined,
//       bankName: form.bankName?.trim() || undefined,
//       accountNumber: form.accountNumber?.trim() || undefined,
//       ifscCode: form.ifscCode?.trim() || undefined,
//       education: educations
//         .filter(
//           (e) =>
//             (e.institution && e.institution.trim()) ||
//             (e.qualification && e.qualification.trim())
//         )
//         .map((e) => ({
//           university: e.university?.trim() || undefined,
//           institution: e.institution?.trim() || undefined,
//           qualification: e.qualification?.trim() || undefined,
//           yearCompleted: e.yearCompleted?.toString().trim() || undefined,
//         })),
//       generateTemp: !!generateTemp,
//       tempPassword: generateTemp ? tempPasswordValue || undefined : undefined,
//     };

//     if (!payload.firstName || !payload.lastName) {
//       setErrors({
//         firstName: "First name required.",
//         lastName: "Last name required.",
//       });
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const result = await Promise.resolve(onSubmit ? onSubmit(payload) : null);
//       setTempPasswordValue("");
//       return result;
//     } catch (err) {
//       setErrors((p) => ({ ...p, submit: err?.message ?? "Submit failed" }));
//       throw err;
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCopyTemp = async () => {
//     try {
//       if (!tempPasswordValue) return;
//       await navigator.clipboard.writeText(tempPasswordValue);
//       alert("Temp password copied to clipboard");
//     } catch (e) {
//       alert("Copy failed — please select and copy manually.");
//     }
//   };

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Step indicator */}
//         <div className="flex gap-3 overflow-auto pb-2">
//           {steps.map((s, i) => {
//             const active = i === step;
//             const done = i < step;
//             return (
//               <div
//                 key={s}
//                 onClick={() => setStep(i)}
//                 className={`flex items-center gap-2 cursor-pointer select-none ${
//                   active
//                     ? "text-blue-600"
//                     : done
//                     ? "text-green-600"
//                     : "text-gray-500"
//                 }`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full flex items-center justify-center border ${
//                     active ? "bg-blue-100" : done ? "bg-green-100" : "bg-white"
//                   }`}
//                 >
//                   {done ? "✓" : i + 1}
//                 </div>
//                 <div className="text-sm font-semibold">{s}</div>
//               </div>
//             );
//           })}
//         </div>

//         <div>
//           {/* fixed mapping for first 4 sections */}
//           {step === 0 && (
//             <BasicInfo
//               form={form}
//               inputProps={inputProps}
//               errors={errors}
//               setField={setField}
//               isView={isView}
//             />
//           )}

//           {step === 1 && (
//             <AddressSection
//               form={form}
//               setField={setField}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {step === 2 && (
//             <EducationSection
//               educations={educations}
//               addEducation={addEducation}
//               updateEducation={updateEducation}
//               removeEducation={removeEducation}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {step === 3 && (
//             <EmploymentBankSection
//               form={form}
//               setField={setField}
//               inputProps={inputProps}
//               errors={errors}
//               isView={isView}
//             />
//           )}

//           {/* Review only when not view and when step matches final index */}
//           {!isView && step === steps.length - 1 && (
//             <ReviewSection
//               form={form}
//               educations={educations}
//               generateTemp={generateTemp}
//               setGenerateTemp={setGenerateTemp}
//               tempPasswordValue={tempPasswordValue}
//               handleCopyTemp={handleCopyTemp}
//               regenerate={() => setTempPasswordValue(generateTempPass(12))}
//             />
//           )}
//         </div>

//         {errors.submit && (
//           <div className="text-sm text-red-600">{errors.submit}</div>
//         )}

//         {/* navigation */}
//         <div className="flex items-center justify-between gap-3">
//           <div>
//             {step > 0 && (
//               <button
//                 type="button"
//                 onClick={goPrev}
//                 className="px-4 py-2 rounded-md border hover:bg-gray-50"
//               >
//                 Back
//               </button>
//             )}
//           </div>

//           <div className="flex items-center gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 rounded-md border hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//             {step < steps.length - 1 && (
//               <button
//                 type="button"
//                 onClick={goNext}
//                 className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
//               >
//                 Next
//               </button>
//             )}

//             {step === steps.length - 1 && !isView && (
//               <button
//                 type="submit"
//                 disabled={submitting}
//                 className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
//               >
//                 {submitting
//                   ? "Saving..."
//                   : isEdit
//                   ? "Save Changes"
//                   : "Create Employee"}
//               </button>
//             )}
//           </div>
//         </div>
//       </form>
//     </>
//   );
// }


// components/EmployeeForm/EmployeeForm.jsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { generateTempPass } from "../../../utils/generateTempPass";
import BasicInfo from "./sections/BasicInfo";
import AddressSection from "./sections/AddressSection";
import EducationSection from "./sections/EducationSection";
import EmploymentBankSection from "./sections/EmploymentBankSection";
import ReviewSection from "./sections/ReviewSection";

/**
 * EmployeeForm (updated)
 *
 * - Payroll shown only in view mode.
 * - Components support history versions with effective month/year dropdown.
 * - Payslips have a year dropdown to view payslips for that year (all months).
 * - Payslip generation chooses components version effective at start of selected year (or latest before).
 * - All non-submit buttons use type="button" to prevent accidental form submission.
 */

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/i;
const aadhaarRegex = /^\d{12}$/;
const phoneRegex = /^\d{10,14}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
const accountRegex = /^[0-9]{6,20}$/;

function toISODateIfValid(v) {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  const s = String(v).trim();
  if (s === "") return null;
  const needsTime = !/T|\+|\-/.test(s);
  const iso = needsTime ? `${s}T00:00:00.000Z` : s;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

/* ---------- small UI helpers ---------- */

function TopTabs({ tabs, active, onChange }) {
  return (
    <nav
      role="tablist"
      aria-label="subtabs"
      className="flex space-x-1 border-b border-gray-300 mb-4 px-2"
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(t.id)}
            className={`relative flex items-center gap-2 px-4 py-2 font-semibold text-sm transition rounded-t-xl ${
              isActive
                ? "bg-[#e7f0fa] text-[#173469] border-b-4 border-[#173469]"
                : "bg-transparent text-gray-500 border-b-4 border-transparent hover:text-[#173469] hover:bg-[#e7f0fa]"
            }`}
          >
            {t.label}
            {t.count ? (
              <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#ffd6db] text-[#9b303d] font-bold text-xs">
                {t.count}
              </span>
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}

function SimpleModal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative z-10 bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button type="button" onClick={onClose} className="px-3 py-1 rounded hover:bg-gray-100">
            Close
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */

export default function EmployeeForm({
  mode = "create",
  initialData = {},
  onCancel,
  onSubmit,
}) {
  const isView = mode === "view";
  const isEdit = mode === "edit";

  // Steps:
  const baseCreateEdit = ["Basic Info", "Address", "Education", "Employment & Bank", "Review"];
  const baseView = ["Basic Info", "Address", "Education", "Employment & Bank", "Payroll"];

  const steps = useMemo(() => (isView ? baseView : baseCreateEdit), [isView]);

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    empId: initialData.empId ?? "",
    firstName: initialData.firstName ?? "",
    lastName: initialData.lastName ?? "",
    dateOfBirth:
      initialData.dateOfBirth && !isNaN(Date.parse(initialData.dateOfBirth))
        ? new Date(initialData.dateOfBirth).toISOString().slice(0, 10)
        : "",
    gender: initialData.gender ?? "",
    aadhaarNumber: initialData.aadhaarNumber ?? "",
    panNumber: initialData.panNumber ?? "",
    email: initialData.email ?? "",
    phoneNumber: initialData.phoneNumber ?? "",
    emergencyContact: initialData.emergencyContact ?? "",
    photo: initialData.photo ?? "",
    bloodGroup: initialData.bloodGroup ?? "",
    presentAddress: initialData.presentAddress ?? "",
    permanentAddress: initialData.permanentAddress ?? "",
    designation: initialData.designation ?? "",
    department: initialData.department ?? "",
    dateOfJoining:
      initialData.dateOfJoining && !isNaN(Date.parse(initialData.dateOfJoining))
        ? new Date(initialData.dateOfJoining).toISOString().slice(0, 10)
        : "",
    workLocation: initialData.workLocation ?? "",
    bankName: initialData.bankName ?? "",
    accountNumber: initialData.accountNumber ?? "",
    ifscCode: initialData.ifscCode ?? "",
  });

  const [educations, setEducations] = useState(
    (initialData.educationDetails || initialData.education || []).length
      ? (initialData.educationDetails || initialData.education || []).map((e) => ({
          university: e.university ?? "",
          institution: e.institution ?? "",
          qualification: e.qualification ?? "",
          yearCompleted: e.yearCompleted ?? "",
        }))
      : [{ university: "", institution: "", qualification: "", yearCompleted: "" }]
  );

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [generateTemp, setGenerateTemp] = useState(true);
  const [tempPasswordValue, setTempPasswordValue] = useState("");

  useEffect(() => {
    setErrors({});
  }, [step]);

  useEffect(() => {
    if (!generateTemp) setTempPasswordValue("");
  }, [generateTemp]);

  const setField = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const addEducation = () =>
    setEducations((p) => [...p, { university: "", institution: "", qualification: "", yearCompleted: "" }]);

  const updateEducation = (idx, field, value) =>
    setEducations((p) => p.map((r, i) => (i === idx ? { ...r, [field]: value } : r)));

  const removeEducation = (idx) => setEducations((p) => p.filter((_, i) => i !== idx));

  const validators = {
    firstName: (v) => (!v || !v.trim() ? "First name is required." : null),
    lastName: (v) => (!v || !v.trim() ? "Last name is required." : null),
    email: (v) => (v && !emailRegex.test(v) ? "Invalid email." : null),
    phoneNumber: (v) => (v && !phoneRegex.test(v.replace(/\D/g, "")) ? "Phone should be digits (10-14)." : null),
    aadhaarNumber: (v) => (v && !aadhaarRegex.test(v) ? "Aadhaar must be 12 digits." : null),
    panNumber: (v) => (v && !panRegex.test(v) ? "PAN format invalid (e.g. ABCDE1234F)." : null),
    ifscCode: (v) => (v && !ifscRegex.test(v) ? "IFSC invalid." : null),
    accountNumber: (v) => (v && !accountRegex.test(v) ? "Account number seems invalid." : null),
    dateOfBirth: (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return "Invalid date.";
      if (d > new Date()) return "DOB can't be in the future.";
      return null;
    },
    dateOfJoining: (v) => {
      if (!v) return null;
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return "Invalid date.";
      return null;
    },
  };

  const validateStep = (s = step) => {
    const newErrors = {};
    if (s === 0) {
      ["firstName", "lastName", "email", "phoneNumber", "aadhaarNumber", "panNumber", "dateOfBirth"].forEach((k) => {
        const msg = validators[k]?.(form[k]);
        if (msg) newErrors[k] = msg;
      });
    } else if (s === 1) {
      if (!form.presentAddress || !form.presentAddress.trim()) newErrors.presentAddress = "Present address is required.";
    } else if (s === 2) {
      const hasValid = educations.some((e) => e.institution && e.institution.trim() && e.qualification && e.qualification.trim());
      if (!hasValid) newErrors.educations = "Add at least one education record (institution + qualification).";
      educations.forEach((e, i) => {
        if (e.yearCompleted && !/^\d{4}$/.test(String(e.yearCompleted).trim())) {
          (newErrors.education_years = newErrors.education_years || {})[i] = "Enter 4-digit year (e.g. 2020)";
        }
      });
    } else if (s === 3) {
      const ifscMsg = validators.ifscCode(form.ifscCode);
      if (ifscMsg) newErrors.ifscCode = ifscMsg;
      const accMsg = validators.accountNumber(form.accountNumber);
      if (accMsg) newErrors.accountNumber = accMsg;
    } else if (s === 4 && isView) {
      if (!componentsForSelectedEffective || componentsForSelectedEffective.length === 0) {
        newErrors.payroll = "Payroll components missing.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const goNext = () => {
    const ok = validateStep(step);
    if (!ok) return;
    const nextStep = Math.min(steps.length - 1, step + 1);

    if (!isView && nextStep === steps.length - 1 && generateTemp && !tempPasswordValue) {
      try {
        setTempPasswordValue(generateTempPass(12));
      } catch (e) {
        setTempPasswordValue(Math.random().toString(36).slice(2, 14).toUpperCase());
      }
    }

    setStep(nextStep);
  };

  const goPrev = () => setStep((s) => Math.max(0, s - 1));

  const inputProps = (name, type = "text", opts = {}) => ({
    name,
    value: form[name] ?? "",
    onChange: (e) => setField(name, e.target.value),
    type,
    readOnly: isView,
    disabled: isView,
    className: "mt-1 w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-400",
    ...opts,
  });

  /* ------------------ PAYROLL (view-only) with history ------------------ */

  // years list (last 6 years)
  const currentYear = new Date().getFullYear();
  const payrollYears = Array.from({ length: 6 }, (_, i) => currentYear - i);

  // months list
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // incoming payroll from initialData (optional)
  const payrollFromData = initialData?.payroll ?? null;

  // components history:
  // Accepts either: payrollFromData.history (array) or we create sample history versions
  // each history item: { id, effectiveYear, effectiveMonth (1-12), components: [{id, group, name, amount}] }
  const defaultHistory = payrollFromData?.history && payrollFromData.history.length
    ? payrollFromData.history
    : [
        {
          id: "ver_2024_04",
          effectiveYear: currentYear - 1,
          effectiveMonth: 4, // Apr of previous year
          components: [
            { id: "basic", group: "Basic", name: "Basic Salary", amount: 28000 },
            { id: "hra", group: "HRA", name: "House Rent Allowance", amount: 7000 },
            { id: "allow1", group: "Allowances", name: "Conveyance", amount: 800 },
            { id: "ded1", group: "Deductions", name: "Professional Tax", amount: 200 },
          ],
        },
        {
          id: "ver_2025_01",
          effectiveYear: currentYear,
          effectiveMonth: 1, // Jan this year
          components: [
            { id: "basic", group: "Basic", name: "Basic Salary", amount: 30000 },
            { id: "hra", group: "HRA", name: "House Rent Allowance", amount: 8000 },
            { id: "allow1", group: "Allowances", name: "Conveyance", amount: 900 },
            { id: "ded1", group: "Deductions", name: "Professional Tax", amount: 250 },
          ],
        },
      ];

  // normalize history: sort by effective date ascending
  const historySorted = [...defaultHistory].sort((a,b) => {
    const da = new Date(a.effectiveYear, (a.effectiveMonth || 1) - 1, 1);
    const db = new Date(b.effectiveYear, (b.effectiveMonth || 1) - 1, 1);
    return da - db;
  });

  const [componentsHistory] = useState(historySorted);

  // build list of effective month-year options from history (formatted label and numeric values)
  const effectiveOptions = componentsHistory.map((h) => ({
    id: h.id,
    year: h.effectiveYear,
    month: h.effectiveMonth || 1,
    label: `${monthNames[(h.effectiveMonth || 1) - 1]} ${h.effectiveYear}`,
  }));

  // selected effective version (default latest)
  const [selectedEffectiveId, setSelectedEffectiveId] = useState(
    effectiveOptions.length ? effectiveOptions[effectiveOptions.length - 1].id : null
  );

  // derive components for selected effective version
  const componentsForSelectedEffective = useMemo(() => {
    const v = componentsHistory.find((h) => h.id === selectedEffectiveId);
    return v ? v.components : [];
  }, [componentsHistory, selectedEffectiveId]);

  // payslips store keyed by year (we generate sample payslips per year)
  // helper: choose components version effective as-of given date (year, month)
  const findComponentsEffectiveAt = (year, month = 1) => {
    // convert to date for comparison
    const targetDate = new Date(year, month - 1, 1);
    // find the last history item with effective date <= targetDate
    let chosen = null;
    for (const h of componentsHistory) {
      const hDate = new Date(h.effectiveYear, (h.effectiveMonth || 1) - 1, 1);
      if (hDate <= targetDate) chosen = h;
      else break;
    }
    // if none found, fallback to earliest
    return chosen ? chosen.components : componentsHistory.length ? componentsHistory[0].components : [];
  };

  // selected payroll year (for payslips)
  const [selectedPayslipYear, setSelectedPayslipYear] = useState(
    payrollFromData?.year ?? currentYear
  );

  // generate payslips for a year: for each month pick components effective at start of year
  const generatePayslipsForYear = (year) => {
    // choose components effective as-of Jan of that year
    const comps = findComponentsEffectiveAt(year, 1);
    const gross = comps.reduce((s, c) => s + Number(c.amount || 0), 0);
    const deductions = comps
      .filter((c) => (c.group || "").toLowerCase().includes("deduct"))
      .reduce((s, c) => s + Number(c.amount || 0), 0);
    const net = gross - deductions;
    return monthNames.map((m, idx) => ({
      id: `${year}-${idx + 1}`,
      year,
      monthIdx: idx,
      monthName: m,
      gross,
      deductions,
      net,
      components: comps.map((c) => ({ ...c })),
    }));
  };

  // payslips for selected year (regenerate if year changes)
  const [payslipsForYear, setPayslipsForYear] = useState(() => {
    return payrollFromData?.payslips && payrollFromData.payslips.length
      ? payrollFromData.payslips.filter((p) => p.year === selectedPayslipYear)
      : generatePayslipsForYear(selectedPayslipYear);
  });

  useEffect(() => {
    // when selectedPayslipYear changes, regenerate using components effective at start of that year
    const generated = payrollFromData?.payslips && payrollFromData.payslips.length
      ? payrollFromData.payslips.filter((p) => p.year === selectedPayslipYear)
      : generatePayslipsForYear(selectedPayslipYear);
    setPayslipsForYear(generated);
    // choose payslip tab by default
  }, [selectedPayslipYear, payrollFromData]); // componentsHistory is used internally by generator

  // payroll internal tabs
  const payrollTabs = [{ id: "components", label: "Components" }, { id: "payslips", label: "Payslips", count: payslipsForYear.length }];
  const [activePayrollTab, setActivePayrollTab] = useState("components");

  // modal for payslip detail
  const [payslipModalOpen, setPayslipModalOpen] = useState(false);
  const [payslipModalData, setPayslipModalData] = useState(null);
  const openPayslipModal = (p) => { setPayslipModalData(p); setPayslipModalOpen(true); };
  const closePayslipModal = () => { setPayslipModalOpen(false); setPayslipModalData(null); };

  // compute totals for currently selected effective version (for display in Components tab)
  const totalGrossEffective = componentsForSelectedEffective.reduce((s, c) => s + Number(c.amount || 0), 0);
  const deductionsEffective = componentsForSelectedEffective
    .filter((c) => (c.group || "").toLowerCase().includes("deduct"))
    .reduce((s, c) => s + Number(c.amount || 0), 0);
  const netEffective = totalGrossEffective - deductionsEffective;
  const ctcEffective = totalGrossEffective * 12;

  /* ------------------ submit handler (unchanged) ------------------ */

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (isView) {
      onCancel?.();
      return;
    }

    for (let i = 0; i < steps.length - 1; i++) {
      const ok = validateStep(i);
      if (!ok) {
        setStep(i);
        return;
      }
    }

    const payload = {
      empId: form.empId || undefined,
      firstName: form.firstName?.trim() || undefined,
      lastName: form.lastName?.trim() || undefined,
      dateOfBirth: toISODateIfValid(form.dateOfBirth),
      gender: form.gender || undefined,
      aadhaarNumber: form.aadhaarNumber?.trim() || undefined,
      panNumber: form.panNumber?.trim() || undefined,
      email: form.email?.trim() || undefined,
      phoneNumber: form.phoneNumber?.replace(/\D/g, "") || undefined,
      emergencyContact: form.emergencyContact?.trim() || undefined,
      photo: form.photo || undefined,
      bloodGroup: form.bloodGroup ?? undefined,
      presentAddress: form.presentAddress?.trim() || undefined,
      permanentAddress: form.permanentAddress?.trim() || undefined,
      designation: form.designation?.trim() || undefined,
      department: form.department?.trim() || undefined,
      dateOfJoining: toISODateIfValid(form.dateOfJoining),
      workLocation: form.workLocation?.trim() || undefined,
      bankName: form.bankName?.trim() || undefined,
      accountNumber: form.accountNumber?.trim() || undefined,
      ifscCode: form.ifscCode?.trim() || undefined,
      education: educations.filter((e) => (e.institution && e.institution.trim()) || (e.qualification && e.qualification.trim())).map((e) => ({
        university: e.university?.trim() || undefined,
        institution: e.institution?.trim() || undefined,
        qualification: e.qualification?.trim() || undefined,
        yearCompleted: e.yearCompleted?.toString().trim() || undefined,
      })),
      generateTemp: !!generateTemp,
      tempPassword: generateTemp ? tempPasswordValue || undefined : undefined,
    };

    if (!payload.firstName || !payload.lastName) {
      setErrors({ firstName: "First name required.", lastName: "Last name required." });
      return;
    }

    try {
      setSubmitting(true);
      const result = await Promise.resolve(onSubmit ? onSubmit(payload) : null);
      setTempPasswordValue("");
      return result;
    } catch (err) {
      setErrors((p) => ({ ...p, submit: err?.message ?? "Submit failed" }));
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyTemp = async () => {
    try {
      if (!tempPasswordValue) return;
      await navigator.clipboard.writeText(tempPasswordValue);
      alert("Temp password copied to clipboard");
    } catch (e) {
      alert("Copy failed — please select and copy manually.");
    }
  };

  /* ------------------ render ------------------ */

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step indicator */}
        <div className="flex gap-3 overflow-auto pb-2">
          {steps.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <div
                key={s}
                onClick={() => setStep(i)}
                className={`flex items-center gap-2 cursor-pointer select-none ${active ? "text-blue-600" : done ? "text-green-600" : "text-gray-500"}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${active ? "bg-blue-100" : done ? "bg-green-100" : "bg-white"}`}>
                  {done ? "✓" : i + 1}
                </div>
                <div className="text-sm font-semibold">{s}</div>
              </div>
            );
          })}
        </div>

        <div>
          {step === 0 && <BasicInfo form={form} inputProps={inputProps} errors={errors} setField={setField} isView={isView} />}

          {step === 1 && <AddressSection form={form} setField={setField} errors={errors} isView={isView} />}

          {step === 2 && <EducationSection educations={educations} addEducation={addEducation} updateEducation={updateEducation} removeEducation={removeEducation} errors={errors} isView={isView} />}

          {step === 3 && <EmploymentBankSection form={form} setField={setField} inputProps={inputProps} errors={errors} isView={isView} />}

          {step === 4 && isView && (
            <div>
              {/* Payroll header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Payroll</h3>
                <div className="text-sm text-gray-600">View salary history and payslips</div>
              </div>

              {/* Controls: Effective Month-Year selector (for components history) + Payslip year */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Components effective from</label>
                  <select
                    value={selectedEffectiveId || ""}
                    onChange={(e) => setSelectedEffectiveId(e.target.value)}
                    className="px-3 py-2 border rounded-md"
                    aria-label="Select effective month-year"
                  >
                    {effectiveOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600">Payslip year</label>
                  <select
                    value={selectedPayslipYear}
                    onChange={(e) => setSelectedPayslipYear(Number(e.target.value))}
                    className="px-3 py-2 border rounded-md"
                    aria-label="Select payslip year"
                  >
                    {payrollYears.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Internal tabs */}
              <TopTabs tabs={payrollTabs} active={activePayrollTab} onChange={setActivePayrollTab} />

              {/* Components tab: single table for the selected effective version */}
              {activePayrollTab === "components" && (
                <div className="bg-white border rounded p-4">
                  <h4 className="text-md font-semibold mb-3">Salary Components — {effectiveOptions.find(o=>o.id===selectedEffectiveId)?.label || "—"}</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Component</th>
                          <th className="pb-2">Group</th>
                          <th className="pb-2 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {componentsForSelectedEffective.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.name}</td>
                            <td className="py-2 text-xs text-gray-500">{c.group}</td>
                            <td className="py-2 text-right">{Number(c.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}

                        <tr className="border-t">
                          <td className="py-2 font-semibold">Gross</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(totalGrossEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t">
                          <td className="py-2 font-semibold">CTC (annually)</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(ctcEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t">
                          <td className="py-2 font-semibold">Deductions</td>
                          <td />
                          <td className="py-2 text-right font-semibold">{Number(deductionsEffective).toLocaleString()}</td>
                        </tr>

                        <tr className="border-t bg-green-50">
                          <td className="py-3 font-bold">Net Pay</td>
                          <td />
                          <td className="py-3 text-right font-bold text-green-700 text-lg">₹ {Number(netEffective).toLocaleString()}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Payslips tab */}
              {activePayrollTab === "payslips" && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {payslipsForYear.map((p) => (
                      <div key={p.id} className="bg-white rounded-lg border p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-sm text-gray-500">{p.monthName} {p.year}</div>
                            <div className="text-lg font-semibold">Net ₹ {Number(p.net).toLocaleString()}</div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button type="button" onClick={() => openPayslipModal(p)} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
                              View
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">Gross: ₹ {Number(p.gross).toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Deductions: ₹ {Number(p.deductions).toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <SimpleModal open={payslipModalOpen} onClose={closePayslipModal} title={`Payslip — ${payslipModalData?.monthName} ${payslipModalData?.year}`}>
                {payslipModalData ? (
                  <div>
                    <div className="mb-4">
                      <div className="text-sm">Gross: ₹ {Number(payslipModalData.gross).toLocaleString()}</div>
                      <div className="text-sm">Deductions: ₹ {Number(payslipModalData.deductions).toLocaleString()}</div>
                      <div className="text-lg font-semibold">Net: ₹ {Number(payslipModalData.net).toLocaleString()}</div>
                    </div>

                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="text-left">
                          <th className="pb-2">Component</th>
                          <th className="pb-2">Group</th>
                          <th className="pb-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payslipModalData.components.map((c) => (
                          <tr key={c.id} className="border-t">
                            <td className="py-2">{c.name}</td>
                            <td className="py-2 text-xs text-gray-500">{c.group}</td>
                            <td className="py-2 text-right">₹ {Number(c.amount || 0).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>No data</div>
                )}
              </SimpleModal>
            </div>
          )}

          {/* Review for create/edit */}
          {!isView && step === steps.length - 1 && (
            <ReviewSection
              form={form}
              educations={educations}
              generateTemp={generateTemp}
              setGenerateTemp={setGenerateTemp}
              tempPasswordValue={tempPasswordValue}
              handleCopyTemp={handleCopyTemp}
              regenerate={() => setTempPasswordValue(generateTempPass(12))}
            />
          )}
        </div>

        {errors.submit && <div className="text-sm text-red-600">{errors.submit}</div>}
        {errors.payroll && <div className="text-sm text-red-600">{errors.payroll}</div>}

        {/* navigation */}
        <div className="flex items-center justify-between gap-3">
          <div>
            {step > 0 && (
              <button type="button" onClick={goPrev} className="px-4 py-2 rounded-md border hover:bg-gray-50">
                Back
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border hover:bg-gray-50">
              Cancel
            </button>

            {step < steps.length - 1 && (
              <button type="button" onClick={goNext} className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Next
              </button>
            )}

            {step === steps.length - 1 && !isView && (
              <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700">
                {submitting ? "Saving..." : isEdit ? "Save Changes" : "Create Employee"}
              </button>
            )}
          </div>
        </div>
      </form>
    </>
  );
}

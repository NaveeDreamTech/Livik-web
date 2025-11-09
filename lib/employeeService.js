// lib/employeeService.js
import { safeExecute } from "./dbHelpers.js";
import bcrypt from "bcrypt";

/** convert date-like value to JS Date or null */
function toDateOrNull(v) {
  if (!v && v !== 0) return null;
  if (v instanceof Date) return v;
  const s = String(v).trim();
  if (!s) return null;
  // if only date part provided, append time to make ISO
  const needsTime = !/T|\+|\-/.test(s);
  const iso = needsTime ? `${s}T00:00:00.000Z` : s;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** generate empId using postgres sequence (uses safeExecute) */
export async function generateEmpId(prefix = "LK", pad = 3) {
  const res = await safeExecute(
    (prismaClient) =>
      prismaClient.$queryRaw`SELECT nextval('employee_number_seq') as seq;`
  );
  const seq = Number(res?.[0]?.seq ?? res?.seq ?? res?.nextval ?? null);
  if (!seq || Number.isNaN(seq)) {
    throw new Error("Failed to get sequence value (employee_number_seq).");
  }
  return `${prefix}${String(seq).padStart(pad, "0")}`;
}

/** Create employee (normalizes dates & nested education)
 *
 * If caller includes `data.tempPassword` (plaintext from client-side generation),
 * this function will:
 *  - hash it server-side (bcrypt),
 *  - remove plaintext from the payload,
 *  - persist only `tempPasswordHash` and set `changedTempPassword` to false and `password` to null.
 *
 * Returns the created employee (including educationDetails).
 */
export async function createEmployee(data) {
  // defensive clone to avoid mutating caller object
  const payload = { ...(data || {}) };

  const educationsInput = Array.isArray(payload.education)
    ? payload.education
    : Array.isArray(payload.educationDetails)
    ? payload.educationDetails
    : [];

  const empFields = {
    firstName: payload.firstName ?? null,
    lastName: payload.lastName ?? null,
    dateOfBirth: toDateOrNull(payload.dateOfBirth),
    gender: payload.gender ?? null,
    aadhaarNumber: payload.aadhaarNumber ?? null,
    panNumber: payload.panNumber ?? null,
    email: payload.email ?? null,
    phoneNumber: payload.phoneNumber ?? null,
    emergencyContact: payload.emergencyContact ?? null,
    photo: payload.photo ?? null,
    bloodGroup: payload.bloodGroup ?? null,
    presentAddress: payload.presentAddress ?? null,
    permanentAddress: payload.permanentAddress ?? null,
    designation: payload.designation ?? null,
    department: payload.department ?? null,
    dateOfJoining: toDateOrNull(payload.dateOfJoining),
    workLocation: payload.workLocation ?? null,
    bankName: payload.bankName ?? null,
    accountNumber: payload.accountNumber ?? null,
    ifscCode: payload.ifscCode ?? null,
  };

  const empId = await generateEmpId();

  const createEducations = educationsInput
    .filter((e) => e && (e.institution || e.qualification || e.university))
    .map((e) => ({
      university: e.university ?? null,
      institution: e.institution ?? null,
      qualification: e.qualification ?? null,
      yearCompleted: e.yearCompleted ?? null,
    }));

  // If client supplied plaintext tempPassword, hash it here
  let tempPasswordHash;
  if (payload.tempPassword) {
    try {
      const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
      tempPasswordHash = await bcrypt.hash(
        String(payload.tempPassword),
        SALT_ROUNDS
      );
    } catch (err) {
      // surface a clear error so caller can handle it
      throw new Error("Failed to hash temporary password");
    } finally {
      // remove plaintext from memory/payload ASAP
      try {
        delete payload.tempPassword;
      } catch (e) {
        /* ignore */
      }
    }
  }

  // auth fields: permanent password not set yet; changedTempPassword false
  const authFields = {
    password: null,
    changedTempPassword: false,
    ...(tempPasswordHash ? { tempPasswordHash } : {}),
  };

  // create employee and nested educations
  const created = await safeExecute((prismaClient) =>
    prismaClient.employee.create({
      data: {
        ...empFields,
        empId,
        ...authFields,
        educationDetails: {
          create: createEducations,
        },
      },
      include: { educationDetails: true },
    })
  );

  return created;
}

/** Get all employees */
export async function getAllEmployees() {
  return safeExecute((prismaClient) =>
    prismaClient.employee.findMany({
      include: { educationDetails: true },
      orderBy: { createdAt: "desc" },
    })
  );
}

/** Get single employee by uuid (id) */
export async function getEmployeeById(id) {
  return safeExecute((prismaClient) =>
    prismaClient.employee.findUnique({
      where: { id },
      include: { educationDetails: true },
    })
  );
}

/**
 * Update employee
 * - Accepts id (uuid) and data (may include `education` array)
 * - Handles education separately: deletes old educations and creates new ones
 */
export async function updateEmployee(id, data) {
  // normalize employee non-education fields
  const employeeData = {};

  if ("firstName" in data) employeeData.firstName = data.firstName ?? null;
  if ("lastName" in data) employeeData.lastName = data.lastName ?? null;
  if ("dateOfBirth" in data)
    employeeData.dateOfBirth = toDateOrNull(data.dateOfBirth);
  if ("gender" in data) employeeData.gender = data.gender ?? null;
  if ("aadhaarNumber" in data)
    employeeData.aadhaarNumber = data.aadhaarNumber ?? null;
  if ("panNumber" in data) employeeData.panNumber = data.panNumber ?? null;
  if ("email" in data) employeeData.email = data.email ?? null;
  if ("phoneNumber" in data)
    employeeData.phoneNumber = data.phoneNumber ?? null;
  if ("emergencyContact" in data)
    employeeData.emergencyContact = data.emergencyContact ?? null;
  if ("photo" in data) employeeData.photo = data.photo ?? null;
  if ("bloodGroup" in data) employeeData.bloodGroup = data.bloodGroup ?? null;
  if ("presentAddress" in data)
    employeeData.presentAddress = data.presentAddress ?? null;
  if ("permanentAddress" in data)
    employeeData.permanentAddress = data.permanentAddress ?? null;
  if ("designation" in data)
    employeeData.designation = data.designation ?? null;
  if ("department" in data) employeeData.department = data.department ?? null;
  if ("dateOfJoining" in data)
    employeeData.dateOfJoining = toDateOrNull(data.dateOfJoining);
  if ("workLocation" in data)
    employeeData.workLocation = data.workLocation ?? null;
  if ("bankName" in data) employeeData.bankName = data.bankName ?? null;
  if ("accountNumber" in data)
    employeeData.accountNumber = data.accountNumber ?? null;
  if ("ifscCode" in data) employeeData.ifscCode = data.ifscCode ?? null;
  if ("empId" in data) employeeData.empId = data.empId ?? undefined; // allow updating empId if needed

  // handle education replacement separately
  const educationsInput = Array.isArray(data.education)
    ? data.education
    : Array.isArray(data.educationDetails)
    ? data.educationDetails
    : null;

  // Update employee fields
  await safeExecute((prismaClient) =>
    prismaClient.employee.update({
      where: { id },
      data: employeeData,
      include: { educationDetails: true },
    })
  );

  // If education present, replace them: delete existing then create new
  if (Array.isArray(educationsInput)) {
    // delete old
    await safeExecute((prismaClient) =>
      prismaClient.education.deleteMany({
        where: { employeeId: id },
      })
    );

    // create new
    const createManyData = educationsInput
      .filter((e) => e && (e.institution || e.qualification || e.university))
      .map((e) => ({
        university: e.university ?? null,
        institution: e.institution ?? null,
        qualification: e.qualification ?? null,
        yearCompleted: e.yearCompleted ?? null,
        employeeId: id,
      }));

    if (createManyData.length > 0) {
      await safeExecute((prismaClient) =>
        prismaClient.education.createMany({ data: createManyData })
      );
    }
  }

  // return fresh employee with educations
  return safeExecute((prismaClient) =>
    prismaClient.employee.findUnique({
      where: { id },
      include: { educationDetails: true },
    })
  );
}

/** delete employee & cascade educations (if not using onDelete cascade) */
export async function deleteEmployee(id) {
  // delete educations explicitly (safe)
  await safeExecute((prismaClient) =>
    prismaClient.education.deleteMany({ where: { employeeId: id } })
  );
  return safeExecute((prismaClient) =>
    prismaClient.employee.delete({ where: { id } })
  );
}

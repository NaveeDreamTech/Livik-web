import { prisma } from "./prisma.js";

// 🧠 Get all employees with their education details
export async function getAllEmployees() {
  return prisma.employee.findMany({
    include: {
      educationDetails: true, // must match schema
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get next numeric from DB sequence and build empId like "LK001"
 */

export async function generateEmpId(prefix = "LK", pad = 3) {
  // Query the DB for next sequence value
  const res =
    await prisma.$queryRaw`SELECT nextval('employee_number_seq') as seq;`;
  // prisma returns an array-like result; normalize
  const seq = Number(res?.[0]?.seq ?? res?.seq ?? res?.nextval ?? null);
  if (!seq || Number.isNaN(seq)) {
    throw new Error(
      "Failed to get sequence value for employee id. Ensure employee_number_seq exists."
    );
  }
  return `${prefix}${String(seq).padStart(pad, "0")}`;
}

// ➕ Create new employee with education details
export async function createEmployee(data) {
  const empId = await generateEmpId();

  // normalize education array (support both keys)
  const educations = Array.isArray(data.education)
    ? data.education
    : Array.isArray(data.educationDetails)
    ? data.educationDetails
    : [];

  // destructure to avoid accidentally passing nested education arrays as plain fields
  const { education, educationDetails, ...employeeFields } = data;

  const created = await prisma.employee.create({
    data: {
      ...employeeFields,
      empId,
      // nested create for relation (must match your Prisma relation field)
      educationDetails: {
        create: educations.map((e) => ({
          university: e.university ?? e.universityName ?? null,
          institution: e.institution ?? e.institutionName ?? null,
          qualification: e.qualification ?? e.qualificationName ?? null,
          yearCompleted: e.yearCompleted ?? e.yearOfCompletion ?? null,
        })),
      },
    },
    include: { educationDetails: true },
  });

  return created;
}

// 🔍 Get one employee by ID
export async function getEmployeeById(id) {
  return prisma.employee.findUnique({
    where: { id },
    include: { educationDetails: true },
  });
}

// ✏️ Update employee (including education details)
export async function updateEmployee(id, data) {
  const { educationDetails, ...employeeData } = data;

  // Update employee
  const updatedEmployee = await prisma.employee.update({
    where: { id },
    data: employeeData,
  });

  // If education details are included, replace them
  if (educationDetails && educationDetails.length > 0) {
    // Delete old records first
    await prisma.education.deleteMany({
      where: { employeeId: id },
    });

    // Add new ones
    await prisma.education.createMany({
      data: educationDetails.map((edu) => ({
        ...edu,
        employeeId: id,
      })),
    });
  }

  return prisma.employee.findUnique({
    where: { id },
    include: { educationDetails: true },
  });
}

// ❌ Delete employee and their education details
export async function deleteEmployee(id) {
  await prisma.education.deleteMany({ where: { employeeId: id } });
  return prisma.employee.delete({ where: { id } });
}

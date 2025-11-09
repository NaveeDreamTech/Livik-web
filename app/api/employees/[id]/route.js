// app/api/employees/[id]/route.js
import { NextResponse } from "next/server";
import {
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../../../../lib/employeeService";

export async function GET(req, context) {
  try {
    // params can be async; await before using
    const params = await context.params;
    const id = params.id;
    const emp = await getEmployeeById(id);
    if (!emp) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(emp);
  } catch (error) {
    console.error("GET employee error:", error);
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req, context) {
  try {
    // await params per Next.js guidance
    const params = await context.params;
    const id = params.id;

    const body = await req.json();

    // minimal validation could be added here

    const updated = await updateEmployee(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT employee error:", error);
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const id = params.id;
    await deleteEmployee(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE employee error:", error);
    return NextResponse.json(
      { error: error.message ?? "Server error" },
      { status: 500 }
    );
  }
}

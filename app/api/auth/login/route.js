import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { phoneNumber, password } = await req.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: "Phone number & password required" },
        { status: 400 }
      );
    }

    const user = await prisma.employee.findFirst({
      where: { phoneNumber },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // User must have either normal password or temp password
    const storedHash = user.password || user.tempPasswordHash;

    if (!storedHash) {
      return NextResponse.json(
        { error: "User has no password set" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, storedHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        empId: user.empId,
        phoneNumber: user.phoneNumber,
        changedTempPassword: user.changedTempPassword,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

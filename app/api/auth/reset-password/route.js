import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { phoneNumber, password } = await req.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { error: "Phone number & new password required" },
        { status: 400 }
      );
    }

    // Find employee by phone
    const user = await prisma.employee.findFirst({
      where: { phoneNumber },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Hash new password
    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Update using UNIQUE ID, not phone number
    await prisma.employee.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Password reset successful",
      user: {
        id: user.id,
        empId: user.empId,
        phoneNumber: user.phoneNumber,
      },
    });

    // Set authentication token cookie (user has verified via OTP and set password)
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

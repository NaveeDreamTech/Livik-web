import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function POST(req) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const user = await prisma.employee.findFirst({
      where: { phoneNumber },
      select: {
        id: true,
        empId: true,
        phoneNumber: true,
        password: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if password exists (not null and not empty)
    const hasPassword = user.password !== null && user.password !== "";

    // Create response
    const response = NextResponse.json({
      success: true,
      hasPassword,
      user: {
        id: user.id,
        empId: user.empId,
        phoneNumber: user.phoneNumber,
      },
    });

    // If password exists, set authentication token cookie (similar to login)
    if (hasPassword) {
      const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");
      response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("CHECK PASSWORD ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

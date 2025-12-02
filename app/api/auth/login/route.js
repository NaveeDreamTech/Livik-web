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
    const storedHash = user.password;

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

    // Create response with success data
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        empId: user.empId,
        phoneNumber: user.phoneNumber,
      },
    });

    // Set token cookie (you can use user.id or generate a JWT token)
    // For now, using a simple token based on user.id
    // In production, consider using a proper JWT or session token
    const token = Buffer.from(`${user.id}:${Date.now()}`).toString("base64");

    response.cookies.set("token", token, {
      httpOnly: true, // Prevents client-side JavaScript access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("LOGIN ERROR DETAILS:", err.message, err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

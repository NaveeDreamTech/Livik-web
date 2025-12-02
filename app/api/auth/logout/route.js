import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear the token cookie by setting it to expire immediately
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expire immediately
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


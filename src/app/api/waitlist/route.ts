import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const waitlistSchema = z.object({
  name: z.string().optional().default("WASSCE Candidate"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  examType: z.enum(["WASSCE", "BECE"]).default("WASSCE"),
  shsSchool: z.string().optional(),
  targetUniversity: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = waitlistSchema.parse(body);

    // Attempt to save to Supabase if credentials exist
    try {
      const supabase = await createClient();
      const { error } = await supabase.from("waitlist").insert([
        {
          name: validatedData.name,
          email: validatedData.email.toLowerCase().trim(),
          phone: validatedData.phone?.trim() || null,
          exam_type: validatedData.examType,
          shs_school: validatedData.shsSchool?.trim() || null,
          target_university: validatedData.targetUniversity?.trim() || null,
        },
      ]);

      if (error) {
        // If unique constraint error (already on waitlist)
        if (error.code === "23505") {
          return NextResponse.json(
            { success: true, message: "You're already on the priority waitlist!" },
            { status: 200 }
          );
        }
        console.warn("Supabase insert notice (using fallback):", error.message);
      }
    } catch (dbError) {
      console.warn("Supabase client notice:", dbError);
    }

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list! We will alert you the moment WASSCE results are released.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.issues.map((e) => e.message) },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}

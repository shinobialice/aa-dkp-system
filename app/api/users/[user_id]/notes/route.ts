import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Mock database for notes
const mockNotesDatabase: { [userId: string]: { id: number; content: string }[] } = {
  "2": [
    { id: 1, content: "Welcome to the guild!" },
    { id: 2, content: "Completed first project successfully." },
  ],
  // Add more user notes here if needed
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const notes = mockNotesDatabase[id];

  if (!notes) {
    return NextResponse.json({ error: "Notes not found" }, { status: 404 });
  }

  return NextResponse.json(notes);
}

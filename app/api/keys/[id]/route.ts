import { NextRequest, NextResponse } from "next/server";
import * as storage from "../storage";
import { requireAuth } from "../auth-helper";

// GET - Fetch a specific API key for authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const { id } = await params;
    const apiKey = await storage.getKeyById(id, userId);

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(apiKey);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch API key" },
      { status: 500 }
    );
  }
}

// PUT - Update an API key for authenticated user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const { id } = await params;
    const body = await request.json();
    const { name, key, value, usage } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // If key is not provided, fetch the existing key to preserve it
    let keyToUpdate = key;
    if (!keyToUpdate) {
      const existingKey = await storage.getKeyById(id, userId);
      if (!existingKey) {
        return NextResponse.json(
          { error: "API key not found" },
          { status: 404 }
        );
      }
      keyToUpdate = existingKey.key;
    }

    const updatedKey = await storage.updateKey(id, name, keyToUpdate, userId, value, usage);

    if (!updatedKey) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedKey);
  } catch (error: unknown) {
    console.error("Error updating API key:", error);
    const errorDetails = error instanceof Error ? error.message : "Unknown error";
    const errorCode = (error as { code?: string })?.code || "UNKNOWN";
    return NextResponse.json(
      { 
        error: "Failed to update API key",
        details: errorDetails,
        code: errorCode
      },
      { status: 500 }
    );
  }
}

// DELETE - Delete an API key for authenticated user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId } = authResult;
    const { id } = await params;
    const deleted = await storage.deleteKey(id, userId);

    if (!deleted) {
      return NextResponse.json(
        { error: "API key not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "API key deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete API key" },
      { status: 500 }
    );
  }
}


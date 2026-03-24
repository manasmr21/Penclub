import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8080";

async function forwardRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const method = request.method;
  const body =
    method === "GET" || method === "HEAD" ? undefined : await request.text();
  const pathname = path.join("/");

  let backendResponse: Response;

  try {
    const target = new URL(pathname, `${BACKEND_URL}/`);
    backendResponse = await fetch(target, {
      method,
      headers: {
        "content-type": request.headers.get("content-type") ?? "application/json",
        cookie: request.headers.get("cookie") ?? "",
      },
      body,
    });
  } catch {
    return NextResponse.json(
      {
        message: "Backend server is unavailable. Make sure the Nest server is running.",
      },
      { status: 502 },
    );
  }

  const responseText = await backendResponse.text();
  const response = new NextResponse(responseText, {
    status: backendResponse.status,
  });

  const contentType = backendResponse.headers.get("content-type");
  const setCookie = backendResponse.headers.get("set-cookie");

  if (contentType) {
    response.headers.set("content-type", contentType);
  }

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return forwardRequest(request, context);
}

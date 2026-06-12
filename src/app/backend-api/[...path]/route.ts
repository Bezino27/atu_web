import { NextResponse, type NextRequest } from "next/server";
import { BACKEND_URL, isBackendConnectionError } from "@/app/lib/api";

export const dynamic = "force-dynamic";

type BackendApiRouteContext = {
  params: Promise<{
    path?: string[];
  }>;
};

const SKIPPED_REQUEST_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

const SKIPPED_RESPONSE_HEADERS = new Set([
  "connection",
  "content-encoding",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function buildBackendUrl(request: NextRequest, path: string[]) {
  const requestPathname = request.nextUrl.pathname;
  const encodedPath = path.map(encodeURIComponent).join("/");
  const backendUrl = new URL(`/api/${encodedPath}`, BACKEND_URL);

  if (requestPathname.endsWith("/") && !backendUrl.pathname.endsWith("/")) {
    backendUrl.pathname = `${backendUrl.pathname}/`;
  }

  backendUrl.search = request.nextUrl.search;

  return backendUrl;
}

function copyHeaders(sourceHeaders: Headers, skippedHeaders: Set<string>) {
  const headers = new Headers();

  sourceHeaders.forEach((value, key) => {
    if (!skippedHeaders.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  return headers;
}

async function proxyBackendRequest(
  request: NextRequest,
  context: BackendApiRouteContext,
) {
  const { path = [] } = await context.params;
  const backendUrl = buildBackendUrl(request, path);
  const method = request.method.toUpperCase();
  const requestHeaders = copyHeaders(request.headers, SKIPPED_REQUEST_HEADERS);
  const body =
    method === "GET" || method === "HEAD"
      ? undefined
      : await request.arrayBuffer();

  try {
    const response = await fetch(backendUrl, {
      method,
      headers: requestHeaders,
      body,
      cache: "no-store",
      redirect: "manual",
    });

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: copyHeaders(response.headers, SKIPPED_RESPONSE_HEADERS),
    });
  } catch (error) {
    if (isBackendConnectionError(error)) {
      return NextResponse.json(
        { detail: "Backend API momentálne nie je dostupné." },
        { status: 503 },
      );
    }

    throw error;
  }
}

export function GET(request: NextRequest, context: BackendApiRouteContext) {
  return proxyBackendRequest(request, context);
}

export function POST(request: NextRequest, context: BackendApiRouteContext) {
  return proxyBackendRequest(request, context);
}

export function PUT(request: NextRequest, context: BackendApiRouteContext) {
  return proxyBackendRequest(request, context);
}

export function PATCH(request: NextRequest, context: BackendApiRouteContext) {
  return proxyBackendRequest(request, context);
}

export function DELETE(request: NextRequest, context: BackendApiRouteContext) {
  return proxyBackendRequest(request, context);
}

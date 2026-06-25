import { revalidatePath } from "next/cache";

const MAX_PATHS = 20;
const MAX_PATH_LENGTH = 300;

type RevalidateRequestBody = {
  paths?: unknown;
  secret?: unknown;
  reason?: unknown;
  club?: unknown;
};

type RevalidateResponseBody =
  | {
      ok: true;
      revalidated: {
        paths: string[];
      };
    }
  | {
      ok: false;
      error: string;
    };

export type RevalidateResponse = {
  body: RevalidateResponseBody;
  status: number;
};

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return null;
  }

  return token;
}

function isValidPath(path: unknown): path is string {
  if (typeof path !== "string") {
    return false;
  }

  return (
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://") &&
    path.length <= MAX_PATH_LENGTH
  );
}

function getValidPaths(paths: unknown[]) {
  return Array.from(new Set(paths.filter(isValidPath)));
}

export async function revalidateFromRequest(
  request: Request,
): Promise<RevalidateResponse> {
  const configuredSecret = process.env.REVALIDATE_SECRET;

  if (!configuredSecret) {
    return {
      body: { ok: false, error: "Revalidation is not configured." },
      status: 500,
    };
  }

  let body: RevalidateRequestBody;

  try {
    body = (await request.json()) as RevalidateRequestBody;
  } catch {
    return {
      body: { ok: false, error: "Invalid JSON body." },
      status: 400,
    };
  }

  const providedSecret =
    getBearerToken(request) ||
    (typeof body.secret === "string" ? body.secret : null);

  if (providedSecret !== configuredSecret) {
    return {
      body: { ok: false, error: "Unauthorized." },
      status: 401,
    };
  }

  if (!Array.isArray(body.paths)) {
    return {
      body: { ok: false, error: "Body field `paths` must be an array." },
      status: 400,
    };
  }

  if (body.paths.length > MAX_PATHS) {
    return {
      body: { ok: false, error: `Maximum ${MAX_PATHS} paths are allowed.` },
      status: 400,
    };
  }

  const validPaths = getValidPaths(body.paths);

  if (validPaths.length === 0) {
    return {
      body: { ok: false, error: "No valid paths to revalidate." },
      status: 400,
    };
  }

  for (const path of validPaths) {
    revalidatePath(path);
  }

  return {
    body: {
      ok: true,
      revalidated: {
        paths: validPaths,
      },
    },
    status: 200,
  };
}

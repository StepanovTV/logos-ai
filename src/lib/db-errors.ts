export const DATABASE_CONNECTION_ERROR_CODE = "DATABASE_CONNECTION_ERROR";

export class DatabaseConnectionError extends Error {
  readonly code = DATABASE_CONNECTION_ERROR_CODE;

  constructor(
    message = "Database connection unavailable. Please ensure PostgreSQL is running.",
  ) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

const CONNECTION_ERROR_CODES = new Set([
  "P1000",
  "P1001",
  "P1002",
  "P1003",
  "P1017",
]);

const PRISMA_CONNECTION_ERROR_NAMES = new Set([
  "PrismaClientInitializationError",
  "PrismaClientKnownRequestError",
  "PrismaClientRustPanicError",
]);

type ErrorRecord = {
  name?: string;
  message?: string;
  code?: string;
};

function toErrorRecord(error: unknown): ErrorRecord | null {
  if (!error || typeof error !== "object") {
    return null;
  }

  const record = error as ErrorRecord;

  return {
    name: typeof record.name === "string" ? record.name : undefined,
    message: typeof record.message === "string" ? record.message : undefined,
    code: typeof record.code === "string" ? record.code : undefined,
  };
}

function hasConnectionMessage(message: string): boolean {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("can't reach database server") ||
    normalized.includes("connection refused") ||
    normalized.includes("econnrefused") ||
    normalized.includes("connect timeout") ||
    normalized.includes("connection timed out") ||
    normalized.includes("the database server is not reachable") ||
    normalized.includes("database connection unavailable")
  );
}

export function isDatabaseConnectionError(error: unknown): boolean {
  const record = toErrorRecord(error);

  if (!record) {
    return false;
  }

  if (record.name === "DatabaseConnectionError") {
    return true;
  }

  if (record.code === DATABASE_CONNECTION_ERROR_CODE) {
    return true;
  }

  if (record.code && CONNECTION_ERROR_CODES.has(record.code)) {
    return true;
  }

  if (record.name && PRISMA_CONNECTION_ERROR_NAMES.has(record.name)) {
    if (record.name === "PrismaClientKnownRequestError") {
      return record.code ? CONNECTION_ERROR_CODES.has(record.code) : false;
    }

    return true;
  }

  if (record.message && hasConnectionMessage(record.message)) {
    return true;
  }

  return false;
}

export function toDatabaseConnectionError(error: unknown): DatabaseConnectionError {
  if (isDatabaseConnectionError(error)) {
    const record = toErrorRecord(error);

    if (record?.message && hasConnectionMessage(record.message)) {
      return new DatabaseConnectionError(record.message);
    }
  }

  return new DatabaseConnectionError();
}

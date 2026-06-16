import {
  DatabaseConnectionError,
  isDatabaseConnectionError,
} from "@/lib/db-errors";

export async function withDatabase<T>(
  operation: () => Promise<T>,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isDatabaseConnectionError(error)) {
      throw new DatabaseConnectionError();
    }

    throw error;
  }
}

import type { Prisma } from "@prisma/client";

type DebateSessionDelegate = {
  update(args: {
    where: { sessionId: string };
    data: Prisma.DebateSessionUpdateInput;
  }): Promise<unknown>;
};

export async function linkArchiveToDebateSession(
  debateSession: DebateSessionDelegate,
  archiveId: string,
  debateSessionId: string,
): Promise<void> {
  await debateSession.update({
    where: { sessionId: debateSessionId },
    data: {
      archive: {
        connect: { id: archiveId },
      },
    },
  });
}

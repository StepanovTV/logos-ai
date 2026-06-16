import { prisma } from "@/lib/prisma";
import { withDatabase } from "@/lib/with-database";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ActiveSessionRedirectPage() {
  const session = await withDatabase(() =>
    prisma.debateSession.findFirst({
      orderBy: { sessionId: "desc" },
    }),
  );

  if (!session) {
    notFound();
  }

  redirect(`/session/${session.sessionId}`);
}

import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function ActiveSessionRedirectPage() {
  const session = await prisma.debateSession.findFirst({
    orderBy: { sessionId: "desc" },
  });

  if (!session) {
    notFound();
  }

  redirect(`/session/${session.sessionId}`);
}

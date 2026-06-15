import { AgentStatusCard } from "@/components/session/AgentStatusCard";
import { DiscussionHistory } from "@/components/session/DiscussionHistory";
import { JointDecisionTerminal } from "@/components/session/JointDecisionTerminal";
import { PageShell } from "@/components/layout/PageShell";
import { hasJointDecision, mapDebateSession } from "@/lib/mappers";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type SessionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;

  const record = await prisma.debateSession.findUnique({
    where: { sessionId: id },
    include: {
      messages: {
        orderBy: { timestamp: "asc" },
      },
    },
  });

  if (!record) {
    notFound();
  }

  const session = mapDebateSession(record);
  const showJointDecision = hasJointDecision(record);

  return (
    <PageShell>
      <div className="mx-auto max-w-5xl">
        <header>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[#849495]">
            ACTIVE DEBATE THREAD
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span
              className="h-3 w-3 shrink-0 rounded-full bg-red-500"
              aria-hidden="true"
            />
            <h1 className="font-heading text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
              {session.topic}
            </h1>
          </div>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AgentStatusCard
            agent="alpha"
            name={session.agents.alpha.name}
            framework={session.agents.alpha.framework}
          />
          <AgentStatusCard
            agent="beta"
            name={session.agents.beta.name}
            framework={session.agents.beta.framework}
          />
        </div>

        <DiscussionHistory history={session.history} />

        {showJointDecision && (
          <div className="mt-8">
            <JointDecisionTerminal decision={session.jointDecision} />
          </div>
        )}
      </div>
    </PageShell>
  );
}

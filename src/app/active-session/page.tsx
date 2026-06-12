import { AgentStatusCard } from "@/components/session/AgentStatusCard";
import { DiscussionHistory } from "@/components/session/DiscussionHistory";
import { JointDecisionTerminal } from "@/components/session/JointDecisionTerminal";
import { PageShell } from "@/components/layout/PageShell";
import { debateSession } from "@/mocks/debateSession";

export default function ActiveSessionPage() {
  const session = debateSession;

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

        <div className="mt-8">
          <JointDecisionTerminal decision={session.jointDecision} />
        </div>
      </div>
    </PageShell>
  );
}

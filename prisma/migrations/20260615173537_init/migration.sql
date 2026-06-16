-- CreateTable
CREATE TABLE "AppSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "accent" TEXT,
    "paramCount" TEXT NOT NULL,
    "contextWindow" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "reasoningStyle" TEXT NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchiveSession" (
    "id" TEXT NOT NULL,
    "debateSessionId" TEXT,
    "category" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "agentAlpha" TEXT NOT NULL,
    "agentBeta" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "resolution" TEXT NOT NULL,
    "nodes" INTEGER,
    "cpu" TEXT,
    "error" TEXT,

    CONSTRAINT "ArchiveSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DebateSession" (
    "sessionId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "alphaName" TEXT NOT NULL,
    "alphaFramework" TEXT NOT NULL,
    "alphaStatus" TEXT NOT NULL,
    "betaName" TEXT NOT NULL,
    "betaFramework" TEXT NOT NULL,
    "betaStatus" TEXT NOT NULL,
    "jointDecisionText" TEXT,
    "alphaAgreement" INTEGER,
    "betaAgreement" INTEGER,

    CONSTRAINT "DebateSession_pkey" PRIMARY KEY ("sessionId")
);

-- CreateTable
CREATE TABLE "DebateMessage" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "agent" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "evidence" TEXT[],

    CONSTRAINT "DebateMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArchiveSession_debateSessionId_key" ON "ArchiveSession"("debateSessionId");

-- AddForeignKey
ALTER TABLE "ArchiveSession" ADD CONSTRAINT "ArchiveSession_debateSessionId_fkey" FOREIGN KEY ("debateSessionId") REFERENCES "DebateSession"("sessionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebateMessage" ADD CONSTRAINT "DebateMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "DebateSession"("sessionId") ON DELETE CASCADE ON UPDATE CASCADE;

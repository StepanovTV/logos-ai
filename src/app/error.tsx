"use client";

import { RouteErrorView } from "@/components/errors/RouteErrorView";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  return <RouteErrorView error={error} reset={reset} />;
}

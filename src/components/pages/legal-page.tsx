import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <section className="bg-mist">
        <Container className="py-12 md:py-20">
          <h1 className="text-h1 text-ink">{title}</h1>
        </Container>
      </section>
      <section className="bg-background">
        <Container className="py-12 md:py-20">
          <div className="mx-auto max-w-[800px] text-body text-slate legal-prose">
            {children}
          </div>
        </Container>
      </section>
    </>
  );
}
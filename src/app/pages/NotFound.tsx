import { Link } from "react-router";
import { Container } from "../components/shared/Container";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");
  return (
    <section className="pt-48 pb-36">
      <Container>
        <p
          className="text-label uppercase tracking-widest text-accent mb-4 font-mono"
        >
          404
        </p>
        <h1
          className="text-4xl md:text-5xl text-foreground mb-6 leading-[1.05] font-display"
        >
          Page not found.
        </h1>
        <p className="text-[15px] text-muted-foreground mb-10 max-w-[30ch] leading-relaxed">
          Nothing lives at this URL.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[13px] text-foreground border border-border px-5 py-2.5 hover:border-accent hover:text-accent transition-colors duration-200"
        >
          Back to home
        </Link>
      </Container>
    </section>
  );
}

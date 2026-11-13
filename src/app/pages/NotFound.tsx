import { Link } from "react-router";

import { buttonClassName } from "../components/shared/Button";
import { Container } from "../components/shared/Container";
import { Headline, HEADLINE_HOVER_NAME } from "../components/shared/Headline";
import { Label } from "../components/shared/Label";
import { usePageTitle } from "../hooks/usePageTitle";

export default function NotFound() {
  usePageTitle("Page Not Found");
  return (
    <section className="pt-48 pb-36">
      <Container>
        <Label as="p" className="mb-4 block !text-accent">
          404
        </Label>
        <Headline as="h1" hover={HEADLINE_HOVER_NAME} className="text-4xl md:text-5xl text-foreground mb-6 leading-[0.95]">
          Page not found.
        </Headline>
        <p className="text-body text-ink-muted mb-10 max-w-[30ch]">Nothing lives at this URL.</p>
        <Link to="/" className={buttonClassName("outline")}>
          Back to home
        </Link>
      </Container>
    </section>
  );
}

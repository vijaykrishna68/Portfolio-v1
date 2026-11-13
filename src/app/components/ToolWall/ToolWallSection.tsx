import { TOOL_GROUPS, CURIOUS_GLYPHS } from "../../content/tools";
import { Container } from "../shared/Container";
import { HEADLINE_HOVER_NAME, Headline } from "../shared/Headline";
import { Label } from "../shared/Label";
import { Reveal } from "../shared/Reveal";
import { SectionLabel } from "../shared/SectionLabel";
import { ToolCell } from "../shared/ToolCell";
import { ToolWall, ToolWallProvider, useAutoLight } from "../shared/ToolWall";

/**
 * The tool wall: 8 glyphs for the real tools (each with a caption listing its
 * technologies), then 4 more under "Curious about" with no captions. One cell
 * is lit at a time; hover, focus or tap moves the light. Nothing is lit at
 * load: the first cell (A1) is lit once, when the wall is at least 60% in view
 * and the Hero composition is under 20% in view (see useAutoLight).
 */
function ToolWallBody() {
  const { wallRef } = useAutoLight("A1-gear-train");

  return (
    <>
      <Reveal>
        <SectionLabel>Tool wall</SectionLabel>
        <Headline as="h2" hover={HEADLINE_HOVER_NAME} className="mt-3 mb-[4.5rem] text-3xl md:text-4xl text-foreground">
          What I build with.
        </Headline>
      </Reveal>

      <Reveal delay={60}>
        <div ref={wallRef}>
          <ToolWall columns={4}>
            {TOOL_GROUPS.map((group) => (
              <ToolCell key={group.glyph} glyph={group.glyph} caption={group.technologies.join(", ")} />
            ))}
          </ToolWall>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <Label as="p" className="mt-12 mb-4 block">
          Curious about
        </Label>
        <ToolWall columns={4}>
          {CURIOUS_GLYPHS.map((glyph) => (
            <ToolCell key={glyph} glyph={glyph} />
          ))}
        </ToolWall>
      </Reveal>
    </>
  );
}

export function ToolWallSection() {
  return (
    <section id="tools" className="py-36 border-t border-border">
      <Container>
        <ToolWallProvider>
          <ToolWallBody />
        </ToolWallProvider>
      </Container>
    </section>
  );
}

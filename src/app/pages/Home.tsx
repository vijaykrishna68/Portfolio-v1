import { Hero } from "../components/Hero/Hero";
import { ToolWallSection } from "../components/ToolWall/ToolWallSection";
import { SelectedWork } from "../components/SelectedWork/SelectedWork";
import { Timeline } from "../components/Timeline/Timeline";
import { Journal } from "../components/Journal/Journal";
import { Playground } from "../components/Playground/Playground";
import { About } from "../components/About/About";
import { usePageTitle } from "../hooks/usePageTitle";

export default function Home() {
  usePageTitle();
  return (
    <>
      <Hero />
      <ToolWallSection />
      <SelectedWork />
      <Timeline />
      <Journal />
      <Playground />
      <About />
    </>
  );
}

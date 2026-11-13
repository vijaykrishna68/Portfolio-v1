export const INTERACTION = {
  fast: "transition-all duration-200 ease-out",
  color: "transition-colors duration-200 ease-out",
  border: "transition-[border-color,background-color,color,box-shadow,transform] duration-[250ms] ease-out",
  lift: "transition-[transform,box-shadow,border-color,background-color,color] duration-[250ms] ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  subtleLift:
    "transition-[transform,box-shadow,border-color,background-color,color] duration-[220ms] ease-out hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0",
  underline: "transition-[width] duration-200 ease-out",
  fadeMove: "transition-[opacity,transform] duration-300 ease-out",
  icon: "transition-all duration-200 ease-out",
} as const;


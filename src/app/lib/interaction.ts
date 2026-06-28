export const INTERACTION = {
  fast: "transition-all duration-200 ease-out",
  color: "transition-colors duration-200 ease-out",
  border: "transition-[border-color,background-color,color,box-shadow,transform] duration-[250ms] ease-out",
  lift: "transition-[transform,box-shadow,border-color,background-color,color] duration-[250ms] ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(26,23,20,0.08)]",
  subtleLift:
    "transition-[transform,box-shadow,border-color,background-color,color] duration-[220ms] ease-out hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(26,23,20,0.06)]",
  underline: "transition-[width] duration-200 ease-out",
  fadeMove: "transition-[opacity,transform] duration-300 ease-out",
  icon: "transition-all duration-200 ease-out",
} as const;

export const BRAND_BLUE = "#68b1f5";
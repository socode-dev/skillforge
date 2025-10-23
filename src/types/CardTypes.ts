import type { MotionProps } from "framer-motion";
// import type React from "react";
import type { ReactNode } from "react";

// interface WhileHover {
//   [index: string]: number | string;
// }
// interface WhileInVew {
//   [index: string]: number | string;
// }

// interface Transition {
//   [index: string]: string | number;
// }
// interface Initial {
//   [index: string]: string | number;
// }
// interface Animate {
//   [index: string]: string | number;
// }
// interface Exit {
//   [index: string]: string | number;
// }

export interface CardProps extends MotionProps {
  children: ReactNode;
  className?: string;
  // whileHover?: WhileHover;
  // transition?: Transition;
  // initial?: Initial;
  // animate?: Animate;
  // exit?: Exit;
  // whileInView?: WhileInVew;
}

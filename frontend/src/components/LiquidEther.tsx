import React from "react";
import { StarsBackground } from "./animate-ui/components/backgrounds/stars";

export interface LiquidEtherProps {
  mouseForce?: number;
  cursorSize?: number;
  isViscous?: boolean;
  viscous?: number;
  iterationsViscous?: number;
  iterationsPoisson?: number;
  dt?: number;
  BFECC?: boolean;
  resolution?: number;
  isBounce?: boolean;
  colors?: string[];
  style?: React.CSSProperties;
  className?: string;
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  takeoverDuration?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

export default function LiquidEther({
  colors,
  style = {},
  className = "",
}: LiquidEtherProps): React.ReactElement {
  // Use the first color from the colors array as the star color if provided
  const starColor = colors && colors.length > 0 ? colors[0] : "#fff";

  return (
    <div style={{ width: '100%', height: '100%', ...style }} className={className}>
      <StarsBackground
        starColor={starColor}
        className="size-full"
      />
    </div>
  );
}

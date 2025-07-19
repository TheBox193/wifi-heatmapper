import { Gradient } from "@/lib/types";

import { createWebGLContext } from "../utils/webGLUtils";
import { createBackgroundLayerRenderer } from "./layers/imageLayerRenderer";
import { createHeatmapLayerRenderer } from "./layers/heatmapLayerRenderer";

export type HeatmapPoint = {
  x: number;
  y: number;
  value: number;
};

/**
 * Render both the BG Image & Heatmap Layers
 */
const mainRenderer = (
  canvas: HTMLCanvasElement,
  points: HeatmapPoint[],
  gradient: Gradient,
) => {
  const gl = createWebGLContext(canvas);
  const bgRenderer = createBackgroundLayerRenderer(gl);
  const heatmapRenderer = createHeatmapLayerRenderer(gl, points, gradient);

  const render = async (props: {
    points: HeatmapPoint[];
    width: number;
    height: number;
    backgroundImageSrc?: string;
    globalOpacity?: number;
    influenceRadius?: number;
  }) => {
    const {
      width,
      height,
      globalOpacity = 0.5,
      influenceRadius = 100,
      backgroundImageSrc,
    } = props;

    canvas.width = width;
    canvas.height = height;

    gl.viewport(0, 0, width, height);

    if (backgroundImageSrc) {
      await bgRenderer.draw(backgroundImageSrc);
    }

    heatmapRenderer.draw({
      width,
      height,
      globalOpacity,
      influenceRadius,
    });
  };

  return { render };
};

export default mainRenderer;

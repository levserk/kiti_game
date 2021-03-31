export const colors = [0xff0040, 0xff00bf, 0x00ff00, 0xff8000, 0x2e2efe];
export const VERTICAL_SQUARES_COUNT = 13;
export const HORIZONTAL_SQUARES_COUNT =7;

export const calcSquareSize = (width, height) => {
  return Math.min(
    Math.floor(width / HORIZONTAL_SQUARES_COUNT),
    Math.floor(height / VERTICAL_SQUARES_COUNT)
  );
};

export const calcFieldSize = (size, width, height) => {
  return {
    width: HORIZONTAL_SQUARES_COUNT * size,
    height: VERTICAL_SQUARES_COUNT * size,
  };
};

export const defaultOptions = {
  width: null,
  height: null,
  speed: 0.3, // sizes
  delayBetweenCreations: 150
};

export function mpx(m, pscale = 60) {
  return m * pscale;
}

export function pxm(p, pscale = 60) {
  return p / pscale;
}
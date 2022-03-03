import { RewardBounds, RewardRange } from "./types";

export const getIntFromEnv = (key: string): number | null => {
  const value = parseInt(process.env[key]);
  if (isNaN(value)) {
    return null;
  }
  return value;
};

export const getRandomRange = (): RewardRange => {
  const random = Math.random();
  if (random < 0.95) {
    return RewardRange.LOWER;
  } else if (random < 0.98) {
    return RewardRange.MEDIUM;
  } else {
    return RewardRange.UPPER;
  }
};

export const DEFAULT_RANGE_VALUES = {
  LOWER_RANGE_MIN: 3,
  LOWER_RANGE_MAX: 10,
  MEDIUM_RANGE_MIN: 10,
  MEDIUM_RANGE_MAX: 25,
  UPPER_RANGE_MIN: 25,
  UPPER_RANGE_MAX: 200,
};

export const getMinMaxFromRange = (range: RewardRange): RewardBounds => {
  switch (range) {
    case RewardRange.LOWER:
      return {
        min:
          getIntFromEnv("LOWER_RANGE_MIN") ||
          DEFAULT_RANGE_VALUES.LOWER_RANGE_MIN,
        max:
          getIntFromEnv("LOWER_RANGE_MAX") ||
          DEFAULT_RANGE_VALUES.LOWER_RANGE_MAX,
      };
    case RewardRange.MEDIUM:
      return {
        min:
          getIntFromEnv("MEDIUM_RANGE_MIN") ||
          DEFAULT_RANGE_VALUES.MEDIUM_RANGE_MIN,
        max:
          getIntFromEnv("MEDIUM_RANGE_MAX") ||
          DEFAULT_RANGE_VALUES.MEDIUM_RANGE_MAX,
      };
    case RewardRange.UPPER:
      return {
        min:
          getIntFromEnv("UPPER_RANGE_MIN") ||
          DEFAULT_RANGE_VALUES.UPPER_RANGE_MIN,
        max:
          getIntFromEnv("UPPER_RANGE_MAX") ||
          DEFAULT_RANGE_VALUES.UPPER_RANGE_MAX,
      };
  }
};

export type UUID = string;

/** { [backgroundName]: \<number of layers it has excluding base\> } */
export const backgrounds = {
  forest: 3,
  mountains: 4,
  grove: 3,
  "grove-2": 3
} as const satisfies Record<string, number>;
export type Background = keyof typeof backgrounds;

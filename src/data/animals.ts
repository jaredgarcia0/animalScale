export type Animal = {
  id: string;
  name: string;
  lengthMeters: number;
};

export type RoundAnimal = {
  animal: Animal;
  scaledLengthMeters: number;
  isCorrectlyScaled: boolean;
};

export const ANIMALS: Animal[] = [
  { id: 'blue-whale', name: 'Blue whale', lengthMeters: 25 },
  { id: 'giraffe', name: 'Giraffe', lengthMeters: 5.2 },
  { id: 'african-elephant', name: 'African elephant', lengthMeters: 4.5 },
  { id: 'lion', name: 'Lion', lengthMeters: 2.5 },
  { id: 'giant-panda', name: 'Giant panda', lengthMeters: 1.5 },
];

export const ROUND_ANIMALS: RoundAnimal[] = [
  {
    animal: ANIMALS[2],
    scaledLengthMeters: ANIMALS[2].lengthMeters,
    isCorrectlyScaled: true,
  },
  {
    animal: ANIMALS[1],
    scaledLengthMeters: 3.8,
    isCorrectlyScaled: false,
  },
];

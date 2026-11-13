import type { ImageSource } from 'expo-image';

export type Animal = {
  id: string;
  name: string;
  lengthMeters: number;
  image: ImageSource;
};

export type RoundAnimal = {
  animal: Animal;
  scaledLengthMeters: number;
  isCorrectlyScaled: boolean;
};

export type MatchRound = {
  id: number;
  animals: RoundAnimal[];
};

export const ANIMALS: Animal[] = [
  { id: 'blue-whale', name: 'Blue whale', lengthMeters: 25, image: require('@/assets/animals/blue-whale.png') },
  { id: 'giraffe', name: 'Giraffe', lengthMeters: 5.2, image: require('@/assets/animals/giraffe.png') },
  { id: 'african-elephant', name: 'African elephant', lengthMeters: 4.5, image: require('@/assets/animals/african-elephant.png') },
  { id: 'lion', name: 'Lion', lengthMeters: 2.5, image: require('@/assets/animals/lion.png') },
  { id: 'giant-panda', name: 'Giant panda', lengthMeters: 1.5, image: require('@/assets/animals/giant-panda.png') },
];

export const MATCH_ROUNDS: MatchRound[] = [
  { id: 1, animals: [
    { animal: ANIMALS[2], scaledLengthMeters: 4.5, isCorrectlyScaled: true },
    { animal: ANIMALS[1], scaledLengthMeters: 3.8, isCorrectlyScaled: false },
  ] },
  { id: 2, animals: [
    { animal: ANIMALS[0], scaledLengthMeters: 20, isCorrectlyScaled: false },
    { animal: ANIMALS[3], scaledLengthMeters: 2.5, isCorrectlyScaled: true },
  ] },
  { id: 3, animals: [
    { animal: ANIMALS[4], scaledLengthMeters: 1.5, isCorrectlyScaled: true },
    { animal: ANIMALS[2], scaledLengthMeters: 3.2, isCorrectlyScaled: false },
  ] },
  { id: 4, animals: [
    { animal: ANIMALS[1], scaledLengthMeters: 5.2, isCorrectlyScaled: true },
    { animal: ANIMALS[0], scaledLengthMeters: 12, isCorrectlyScaled: false },
  ] },
  { id: 5, animals: [
    { animal: ANIMALS[3], scaledLengthMeters: 1.3, isCorrectlyScaled: false },
    { animal: ANIMALS[4], scaledLengthMeters: 1.5, isCorrectlyScaled: true },
  ] },
];

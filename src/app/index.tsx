import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Slider } from '@expo/ui/community/slider';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { ROUND_ANIMALS, type RoundAnimal } from '@/data/animals';
import { calculatePercentageError } from '@/lib/scale';

const MIN_SIZE_METERS = 0.5;
const MAX_SIZE_METERS = 10;

function formatMeters(value: number) {
  return `${value.toFixed(1)} m`;
}

type AnimalCardProps = {
  roundAnimal: RoundAnimal;
  isSelected: boolean;
  onPress: () => void;
};

function AnimalCard({ roundAnimal, isSelected, onPress }: AnimalCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [styles.animalCard, isSelected && styles.selectedCard, pressed && styles.pressed]}>
      <ThemedText type="subtitle" style={styles.animalName}>
        {roundAnimal.animal.name}
      </ThemedText>
      <ThemedText themeColor="textSecondary">
        {roundAnimal.isCorrectlyScaled ? 'Correctly scaled' : 'Incorrectly scaled'}
      </ThemedText>
      <ThemedText type="small" style={styles.cardLength}>
        Shown size: {formatMeters(roundAnimal.scaledLengthMeters)}
      </ThemedText>
      {isSelected && (
        <ThemedText type="smallBold" themeColor="textSecondary">
          Selected
        </ThemedText>
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const [selectedId, setSelectedId] = useState(ROUND_ANIMALS[1].animal.id);
  const [adjustedSize, setAdjustedSize] = useState(ROUND_ANIMALS[1].scaledLengthMeters);
  const [result, setResult] = useState<number | null>(null);

  const selectedAnimal = ROUND_ANIMALS.find(({ animal }) => animal.id === selectedId) ?? ROUND_ANIMALS[0];

  function selectAnimal(roundAnimal: RoundAnimal) {
    setSelectedId(roundAnimal.animal.id);
    setAdjustedSize(roundAnimal.scaledLengthMeters);
    setResult(null);
  }

  function submitGuess() {
    setResult(calculatePercentageError(selectedAnimal.animal.lengthMeters, adjustedSize));
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            <ThemedView style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                Animal Scale
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.description}>
                Round 1: Which animal has been scaled incorrectly?
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.cards}>
              {ROUND_ANIMALS.map((roundAnimal) => (
                <AnimalCard
                  key={roundAnimal.animal.id}
                  roundAnimal={roundAnimal}
                  isSelected={roundAnimal.animal.id === selectedId}
                  onPress={() => selectAnimal(roundAnimal)}
                />
              ))}
            </ThemedView>

            <ThemedView type="backgroundElement" style={styles.controls}>
              <ThemedText type="smallBold">Adjust the selected animal&apos;s size</ThemedText>
              <ThemedText type="subtitle" style={styles.currentSize}>
                {formatMeters(adjustedSize)}
              </ThemedText>
              <Slider
                accessibilityLabel={`Adjust ${selectedAnimal.animal.name} size`}
                minimumValue={MIN_SIZE_METERS}
                maximumValue={MAX_SIZE_METERS}
                step={0.1}
                value={adjustedSize}
                onValueChange={(value) => {
                  setAdjustedSize(value);
                  setResult(null);
                }}
                style={styles.slider}
              />
              <ThemedView style={styles.sliderLabels}>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatMeters(MIN_SIZE_METERS)}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {formatMeters(MAX_SIZE_METERS)}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <Pressable
              accessibilityRole="button"
              onPress={submitGuess}
              style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
              <ThemedText themeColor="background" style={styles.submitLabel}>
                Submit Guess
              </ThemedText>
            </Pressable>

            {result !== null && (
              <ThemedView type="backgroundElement" style={styles.result}>
                <ThemedText type="smallBold">Your result</ThemedText>
                <ThemedText style={styles.resultText}>
                  {selectedAnimal.animal.name} was adjusted to {formatMeters(adjustedSize)}.
                </ThemedText>
                <ThemedText themeColor="textSecondary">
                  Percentage error: {result.toFixed(1)}%
                </ThemedText>
              </ThemedView>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
  },
  content: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
    paddingVertical: Spacing.four,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    gap: Spacing.three,
    flexWrap: 'wrap',
  },
  animalCard: {
    flexGrow: 1,
    flexBasis: 260,
    gap: Spacing.two,
    minHeight: 150,
    padding: Spacing.three,
    borderRadius: Spacing.three,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#3C87F7',
  },
  animalName: {
    fontSize: 24,
    lineHeight: 30,
  },
  cardLength: {
    marginTop: 'auto',
  },
  controls: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  currentSize: {
    fontSize: 28,
    lineHeight: 34,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    backgroundColor: '#3C87F7',
  },
  submitLabel: {
    fontWeight: '700',
  },
  result: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Spacing.three,
  },
  resultText: {
    lineHeight: 24,
  },
  pressed: {
    opacity: 0.72,
  },
});

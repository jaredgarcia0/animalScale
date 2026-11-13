import { useState } from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { Slider } from '@expo/ui/community/slider';
import { Image, type ImageSource } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { MATCH_ROUNDS, type MatchRound, type RoundAnimal } from '@/data/animals';
import { useTheme } from '@/hooks/use-theme';
import { calculatePercentageError, calculateRoundScore } from '@/lib/scale';

const MIN_SIZE_METERS = 0.5;
const MAX_SIZE_METERS = 30;
const PLAYER_NAMES = ['Player 1', 'Player 2'] as const;

function formatMeters(value: number) {
  return `${value.toFixed(1)} m`;
}

function formatDisplayedSize(value: number, showMeasurements: boolean) {
  return showMeasurements ? formatMeters(value) : 'Measurement hidden';
}

function getShadowWidth(sizeMeters: number) {
  return `${Math.min(100, Math.max(20, (sizeMeters / MAX_SIZE_METERS) * 100))}%` as `${number}%`;
}

type AnimalCardProps = {
  roundAnimal: RoundAnimal;
  isSelected: boolean;
  shadowSizeMeters: number;
  showMeasurements: boolean;
  onPress: () => void;
};

function AnimalShadow({ sizeMeters, image }: { sizeMeters: number; image: ImageSource }) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.shadowTrack}>
      <Image
        accessibilityLabel="Animal silhouette"
        contentFit="contain"
        source={image}
        tintColor={theme.text}
        style={[styles.animalShadow, { width: getShadowWidth(sizeMeters) }]}
      />
    </ThemedView>
  );
}

function AnimalCard({ roundAnimal, isSelected, shadowSizeMeters, showMeasurements, onPress }: AnimalCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [styles.animalCard, isSelected && styles.selectedCard, pressed && styles.pressed]}>
      <ThemedText type="subtitle" style={styles.animalName}>
        {roundAnimal.animal.name}
      </ThemedText>
      <AnimalShadow image={roundAnimal.animal.image} sizeMeters={shadowSizeMeters} />
      <ThemedText type="small" style={styles.cardLength}>
        {showMeasurements ? `Shown size: ${formatMeters(shadowSizeMeters)}` : 'Shown size hidden'}
      </ThemedText>
      {isSelected && (
        <ThemedText type="smallBold" themeColor="textSecondary">
          Selected
        </ThemedText>
      )}
    </Pressable>
  );
}

type ScoreboardProps = {
  scores: number[];
};

function Scoreboard({ scores }: ScoreboardProps) {
  return (
    <ThemedView type="backgroundElement" style={styles.scoreboard}>
      <ThemedText type="smallBold">Match scoreboard</ThemedText>
      <ThemedView style={styles.scoreRows}>
        {PLAYER_NAMES.map((player, index) => (
          <ThemedView key={player} style={styles.scoreRow}>
            <ThemedText>{player}</ThemedText>
            <ThemedText type="smallBold">{scores[index]} points</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

export default function HomeScreen() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [scores, setScores] = useState([0, 0]);
  const [selectedId, setSelectedId] = useState(MATCH_ROUNDS[0].animals[1].animal.id);
  const [adjustedSize, setAdjustedSize] = useState(MATCH_ROUNDS[0].animals[1].scaledLengthMeters);
  const [result, setResult] = useState<{ error: number; points: number } | null>(null);
  const [matchComplete, setMatchComplete] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(true);

  const currentRound: MatchRound = MATCH_ROUNDS[roundIndex];
  const selectedAnimal = currentRound.animals.find(({ animal }) => animal.id === selectedId) ?? currentRound.animals[0];
  const currentPlayer = PLAYER_NAMES[playerIndex];

  function selectAnimal(roundAnimal: RoundAnimal) {
    setSelectedId(roundAnimal.animal.id);
    setAdjustedSize(roundAnimal.scaledLengthMeters);
    setResult(null);
  }

  function toggleMeasurements() {
    setShowMeasurements((visible) => !visible);
  }

  function submitGuess() {
    const error = calculatePercentageError(selectedAnimal.animal.lengthMeters, adjustedSize);
    const points = calculateRoundScore(error);
    setScores((currentScores) => currentScores.map((score, index) => index === playerIndex ? score + points : score));
    setResult({ error, points });
  }

  function continueMatch() {
    if (playerIndex === 0) {
      setPlayerIndex(1);
      setResult(null);
      return;
    }

    if (roundIndex === MATCH_ROUNDS.length - 1) {
      setMatchComplete(true);
      return;
    }

    const nextRound = MATCH_ROUNDS[roundIndex + 1];
    setRoundIndex(roundIndex + 1);
    setPlayerIndex(0);
    setSelectedId(nextRound.animals[1].animal.id);
    setAdjustedSize(nextRound.animals[1].scaledLengthMeters);
    setResult(null);
  }

  function restartMatch() {
    const firstRound = MATCH_ROUNDS[0];
    setRoundIndex(0);
    setPlayerIndex(0);
    setScores([0, 0]);
    setSelectedId(firstRound.animals[1].animal.id);
    setAdjustedSize(firstRound.animals[1].scaledLengthMeters);
    setResult(null);
    setMatchComplete(false);
    setShowMeasurements(true);
  }

  if (matchComplete) {
    const winner = scores[0] === scores[1] ? 'It is a tie!' : `${scores[0] > scores[1] ? PLAYER_NAMES[0] : PLAYER_NAMES[1]} wins!`;

    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <ThemedView style={styles.content}>
              <ThemedView style={styles.header}>
                <ThemedText type="title" style={styles.title}>Match complete</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.description}>{winner}</ThemedText>
              </ThemedView>
              <Scoreboard scores={scores} />
              <Pressable accessibilityRole="button" onPress={restartMatch} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                <ThemedText themeColor="background" style={styles.submitLabel}>Play Again</ThemedText>
              </Pressable>
            </ThemedView>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.content}>
            <ThemedView style={styles.header}>
              <ThemedText type="title" style={styles.title}>Animal Scale</ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.description}>
                Round {currentRound.id} of {MATCH_ROUNDS.length} · {currentPlayer}&apos;s turn
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.cards}>
              {currentRound.animals.map((roundAnimal) => (
                <AnimalCard
                  key={roundAnimal.animal.id}
                  roundAnimal={roundAnimal}
                  isSelected={roundAnimal.animal.id === selectedId}
                  shadowSizeMeters={roundAnimal.animal.id === selectedId ? adjustedSize : roundAnimal.scaledLengthMeters}
                  showMeasurements={showMeasurements}
                  onPress={() => selectAnimal(roundAnimal)}
                />
              ))}
            </ThemedView>

            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: showMeasurements }}
              onPress={toggleMeasurements}
              style={({ pressed }) => [styles.measurementToggle, pressed && styles.pressed]}>
              <ThemedText type="smallBold">
                Measurements: {showMeasurements ? 'On' : 'Hidden'}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {showMeasurements ? 'Hide sizes for both players' : 'Show sizes for both players'}
              </ThemedText>
            </Pressable>

            <ThemedView type="backgroundElement" style={styles.controls}>
              <ThemedText type="smallBold">Adjust the selected animal&apos;s size</ThemedText>
              <ThemedText type="subtitle" style={styles.currentSize}>
                {formatDisplayedSize(adjustedSize, showMeasurements)}
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
                  {showMeasurements ? formatMeters(MIN_SIZE_METERS) : 'Smaller'}
                </ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  {showMeasurements ? formatMeters(MAX_SIZE_METERS) : 'Larger'}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            {!result && (
              <Pressable accessibilityRole="button" onPress={submitGuess} style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}>
                <ThemedText themeColor="background" style={styles.submitLabel}>Submit Guess</ThemedText>
              </Pressable>
            )}

            {result && (
              <ThemedView type="backgroundElement" style={styles.result}>
                <ThemedText type="smallBold">{currentPlayer}&apos;s result</ThemedText>
                <ThemedText style={styles.resultText}>
                  {showMeasurements ? `Adjusted size: ${formatMeters(adjustedSize)}` : 'Size measurement hidden'}
                </ThemedText>
                <ThemedText style={styles.resultText}>Percentage error: {result.error.toFixed(1)}%</ThemedText>
                <ThemedText themeColor="textSecondary">Points earned: {result.points}</ThemedText>
                <Pressable accessibilityRole="button" onPress={continueMatch} style={({ pressed }) => [styles.nextButton, pressed && styles.pressed]}>
                  <ThemedText themeColor="background" style={styles.submitLabel}>
                    {playerIndex === 0 ? 'Pass to Player 2' : roundIndex === MATCH_ROUNDS.length - 1 ? 'See Final Score' : 'Next Round'}
                  </ThemedText>
                </Pressable>
              </ThemedView>
            )}

            <Scoreboard scores={scores} />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  safeArea: { flex: 1, paddingBottom: BottomTabInset + Spacing.three },
  scrollContent: { flexGrow: 1, paddingHorizontal: Spacing.four },
  content: { alignSelf: 'center', width: '100%', maxWidth: MaxContentWidth, gap: Spacing.four, paddingVertical: Spacing.four },
  header: { alignItems: 'center', gap: Spacing.two },
  title: { textAlign: 'center' },
  description: { textAlign: 'center' },
  cards: { flexDirection: 'row', gap: Spacing.three, flexWrap: 'wrap' },
  animalCard: { flexGrow: 1, flexBasis: 260, gap: Spacing.two, minHeight: 150, padding: Spacing.three, borderRadius: Spacing.three, borderWidth: 2, borderColor: 'transparent' },
  selectedCard: { borderColor: '#3C87F7' },
  animalName: { fontSize: 24, lineHeight: 30 },
  shadowTrack: { justifyContent: 'center', alignItems: 'center', width: '100%', height: 100, backgroundColor: 'transparent' },
  animalShadow: { height: 100 },
  cardLength: { marginTop: 'auto' },
  measurementToggle: { gap: Spacing.one, padding: Spacing.three, borderRadius: Spacing.three, borderWidth: 1, borderColor: '#3C87F7' },
  controls: { gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  currentSize: { fontSize: 28, lineHeight: 34 },
  slider: { width: '100%', height: 40 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between' },
  submitButton: { alignItems: 'center', justifyContent: 'center', minHeight: 52, paddingHorizontal: Spacing.four, borderRadius: Spacing.three, backgroundColor: '#3C87F7' },
  nextButton: { alignItems: 'center', justifyContent: 'center', minHeight: 48, marginTop: Spacing.two, paddingHorizontal: Spacing.three, borderRadius: Spacing.three, backgroundColor: '#3C87F7' },
  submitLabel: { fontWeight: '700' },
  result: { gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  resultText: { lineHeight: 24 },
  scoreboard: { gap: Spacing.two, padding: Spacing.three, borderRadius: Spacing.three },
  scoreRows: { gap: Spacing.two },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-between' },
  pressed: { opacity: 0.72 },
});

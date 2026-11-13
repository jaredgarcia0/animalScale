import { Pressable, SafeAreaView, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ActionButtonProps = {
  label: string;
  variant?: 'primary' | 'secondary';
};

function ActionButton({ label, variant = 'secondary' }: ActionButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => undefined}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variant === 'primary' ? '#3C87F7' : theme.backgroundElement },
        pressed && styles.pressed,
      ]}>
      <ThemedText
        style={styles.buttonLabel}
        themeColor={variant === 'primary' ? 'background' : 'text'}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.hero}>
            <ThemedText type="title" style={styles.title}>
              Animal Scale
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.description}>
              Compare the sizes of amazing animals and see how well you can place them on the
              scale.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.actions}>
            <ActionButton label="Create Game" variant="primary" />
            <ActionButton label="Join Game" />
            <ActionButton label="How to Play" />
          </ThemedView>
        </ThemedView>
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
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  content: {
    alignSelf: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    maxWidth: MaxContentWidth,
    gap: Spacing.six,
  },
  hero: {
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    maxWidth: 520,
    textAlign: 'center',
  },
  actions: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 360,
    gap: Spacing.two,
  },
  button: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
  },
  buttonLabel: {
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.72,
  },
});

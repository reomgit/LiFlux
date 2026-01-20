import { StyleSheet, View, Text, Switch, ScrollView } from 'react-native';
import { Screen } from '../../src/components/layout/Screen';
import { GlassContainer } from '../../src/components/common/GlassContainer';
import { colors } from '../../src/theme/colors';
import { typography } from '../../src/theme/typography';
import { spacing } from '../../src/theme/spacing';

export default function SettingsScreen() {
  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Storage</Text>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>iCloud Sync</Text>
              <Text style={styles.settingDescription}>
                Sync notes across your devices
              </Text>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: colors.neutral[300], true: colors.primary[500] }}
              thumbColor={colors.neutral[0]}
            />
          </View>

          <Text style={styles.comingSoon}>Coming soon</Text>
        </GlassContainer>

        <GlassContainer style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>About</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>

          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>MVP</Text>
          </View>
        </GlassContainer>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    ...typography.headlineLarge,
    color: colors.neutral[900],
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.neutral[900],
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    ...typography.bodyLarge,
    color: colors.neutral[900],
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.neutral[500],
    marginTop: 2,
  },
  comingSoon: {
    ...typography.labelSmall,
    color: colors.primary[500],
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  aboutLabel: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  aboutValue: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
});

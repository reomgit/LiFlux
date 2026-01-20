import React from 'react';
import { StyleSheet, View, Text, ScrollView, Switch } from 'react-native';
import { Screen } from '../components/layout/Screen';
import { GlassCard } from '../components/common/GlassCard';
import { Icon } from '../components/common/Icon';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export function SettingsScreen() {
  const [iCloudEnabled, setICloudEnabled] = React.useState(false);

  return (
    <Screen edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.sectionTitle}>Storage</Text>
        <GlassCard>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Icon name="Cloud" size={20} color={colors.primary[600]} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>iCloud Sync</Text>
                <Text style={styles.settingDescription}>
                  Sync your notes across all your devices
                </Text>
              </View>
            </View>
            <Switch
              value={iCloudEnabled}
              onValueChange={setICloudEnabled}
              trackColor={{
                false: colors.neutral[300],
                true: colors.primary[400]
              }}
              thumbColor={iCloudEnabled ? colors.primary[600] : colors.neutral[100]}
            />
          </View>
        </GlassCard>

        <Text style={styles.sectionTitle}>About</Text>
        <GlassCard>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutValue}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Build</Text>
            <Text style={styles.aboutValue}>1</Text>
          </View>
        </GlassCard>

        <Text style={styles.footer}>
          LiFlux - Your Private Digital Memory
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
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
    paddingBottom: 120,
  },
  sectionTitle: {
    ...typography.titleSmall,
    color: colors.neutral[500],
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: spacing.md,
    flex: 1,
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
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  aboutLabel: {
    ...typography.bodyMedium,
    color: colors.neutral[600],
  },
  aboutValue: {
    ...typography.bodyMedium,
    color: colors.neutral[900],
  },
  divider: {
    height: 1,
    backgroundColor: colors.neutral[200],
    marginVertical: spacing.sm,
  },
  footer: {
    ...typography.bodySmall,
    color: colors.neutral[400],
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});

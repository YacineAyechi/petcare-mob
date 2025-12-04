import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Bell, Calendar, Shield } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock notification data
const reminders = [
  {
    id: "1",
    type: "vaccination",
    title: "Vaccination Reminder",
    petName: "Max",
    vaccineName: "Bordetella",
    dueDate: "2024-01-20",
    enabled: true,
    Icon: Shield,
  },
  {
    id: "2",
    type: "vaccination",
    title: "Vaccination Reminder",
    petName: "Luna",
    vaccineName: "Rabies",
    dueDate: "2024-01-25",
    enabled: true,
    Icon: Shield,
  },
  {
    id: "3",
    type: "appointment",
    title: "Appointment Reminder",
    petName: "Max",
    appointmentType: "Check-up",
    date: "2024-01-18",
    enabled: true,
    Icon: Calendar,
  },
  {
    id: "4",
    type: "medication",
    title: "Medication Reminder",
    petName: "Charlie",
    medicationName: "Heartworm Prevention",
    time: "9:00 AM",
    enabled: false,
    Icon: Bell,
  },
];

export default function NotificationsScreen() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [vaccineReminders, setVaccineReminders] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [medicationReminders, setMedicationReminders] = useState(true);
  const [reminderStates, setReminderStates] = useState<Record<string, boolean>>(
    Object.fromEntries(reminders.map((r) => [r.id, r.enabled]))
  );

  const toggleReminder = (id: string) => {
    setReminderStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Push Notifications Toggle */}
        <Card style={styles.section}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <View style={styles.settingHeader}>
                <Bell size={20} color={theme.colors.primary} />
                <Text style={styles.settingLabel}>Push Notifications</Text>
              </View>
              <Text style={styles.settingDescription}>
                Enable to receive push notifications
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
        </Card>

        {/* Reminder Categories */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Reminder Categories</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vaccine Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified about upcoming vaccinations
              </Text>
            </View>
            <Switch
              value={vaccineReminders}
              onValueChange={setVaccineReminders}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Appointment Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified about upcoming appointments
              </Text>
            </View>
            <Switch
              value={appointmentReminders}
              onValueChange={setAppointmentReminders}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Medication Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified about medication doses
              </Text>
            </View>
            <Switch
              value={medicationReminders}
              onValueChange={setMedicationReminders}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary,
              }}
              thumbColor={theme.colors.white}
            />
          </View>
        </Card>

        {/* Active Reminders */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Active Reminders</Text>
          {reminders.map((reminder) => {
            const ReminderIcon = reminder.Icon;
            return (
              <View key={reminder.id}>
                <View style={styles.reminderRow}>
                  <View style={styles.reminderInfo}>
                    <View style={styles.reminderHeader}>
                      <View
                        style={[
                          styles.reminderIcon,
                          {
                            backgroundColor:
                              reminder.type === "vaccination"
                                ? theme.colors.secondary + "20"
                                : reminder.type === "appointment"
                                ? theme.colors.primary + "20"
                                : theme.colors.warning + "20",
                          },
                        ]}
                      >
                        <ReminderIcon
                          size={20}
                          color={
                            reminder.type === "vaccination"
                              ? theme.colors.secondary
                              : reminder.type === "appointment"
                              ? theme.colors.primary
                              : theme.colors.warning
                          }
                        />
                      </View>
                      <View style={styles.reminderContent}>
                        <Text style={styles.reminderTitle}>
                          {reminder.title}
                        </Text>
                        <Text style={styles.reminderDetails}>
                          {reminder.petName}
                          {reminder.type === "vaccination"
                            ? ` • ${reminder.vaccineName}`
                            : reminder.type === "appointment"
                            ? ` • ${reminder.appointmentType}`
                            : ` • ${reminder.medicationName}`}
                        </Text>
                        <Text style={styles.reminderDate}>
                          {reminder.type === "vaccination"
                            ? `Due: ${reminder.dueDate}`
                            : reminder.type === "appointment"
                            ? `Date: ${reminder.date}`
                            : `Time: ${reminder.time}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Switch
                    value={reminderStates[reminder.id]}
                    onValueChange={() => toggleReminder(reminder.id)}
                    trackColor={{
                      false: theme.colors.border,
                      true: theme.colors.primary,
                    }}
                    thumbColor={theme.colors.white}
                  />
                </View>
                {reminder.id !== reminders[reminders.length - 1].id && (
                  <View style={styles.divider} />
                )}
              </View>
            );
          })}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  placeholder: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  settingHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  settingLabel: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "500",
  },
  settingDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  reminderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  reminderInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  reminderHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.md,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  reminderDetails: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  reminderDate: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
  },
});



import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Stethoscope,
} from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - in real app, fetch by ID
const appointments = [
  {
    id: "1",
    petName: "Max",
    petBreed: "Golden Retriever",
    date: "2024-01-15",
    time: "10:00 AM",
    clinic: "VetCare Clinic",
    address: "123 Main St, City",
    phone: "+1 234-567-8900",
    type: "Vaccination",
    status: "accepted",
    notes: "Annual vaccination check-up",
    veterinarian: "Dr. Sarah Johnson",
    vetDecision: "accepted",
    vetNotes: "Appointment confirmed. Please arrive 10 minutes early.",
  },
  {
    id: "2",
    petName: "Luna",
    petBreed: "Persian Cat",
    date: "2024-01-18",
    time: "2:30 PM",
    clinic: "Animal Hospital",
    address: "456 Oak Ave, City",
    phone: "+1 234-567-8901",
    type: "Check-up",
    status: "pending",
    notes: "Regular health check",
    veterinarian: "Dr. Michael Chen",
    vetDecision: "pending",
    vetNotes: "",
  },
  {
    id: "3",
    petName: "Charlie",
    petBreed: "Beagle",
    date: "2024-01-20",
    time: "11:00 AM",
    clinic: "Pet Wellness Center",
    address: "789 Pine Rd, City",
    phone: "+1 234-567-8902",
    type: "Grooming",
    status: "rescheduled",
    notes: "Full grooming service",
    veterinarian: "Dr. Emily Davis",
    vetDecision: "rescheduled",
    vetNotes: "Rescheduled to next week due to availability.",
    newDate: "2024-01-27",
    newTime: "11:00 AM",
  },
];

const statusColors = {
  confirmed: theme.colors.success,
  pending: theme.colors.warning,
  cancelled: theme.colors.error,
  accepted: theme.colors.success,
  rejected: theme.colors.error,
  rescheduled: theme.colors.info,
};

export default function AppointmentDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const appointment = appointments.find((apt) => apt.id === id);

  if (!appointment) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Appointment Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Appointment not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const statusColor =
    statusColors[appointment.status as keyof typeof statusColors];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Appointment Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Badge */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor + "20" },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor }]}>
              {appointment.vetDecision
                ? appointment.vetDecision.toUpperCase()
                : appointment.status.toUpperCase()}
            </Text>
          </View>
          {appointment.vetDecision === "rescheduled" && appointment.newDate && (
            <Text style={styles.rescheduledText}>
              New Date: {appointment.newDate} at {appointment.newTime}
            </Text>
          )}
        </View>

        {/* Veterinarian Decision Section */}
        {appointment.vetDecision && appointment.vetDecision !== "pending" && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name={
                  appointment.vetDecision === "accepted"
                    ? "checkmark-circle"
                    : appointment.vetDecision === "rejected"
                    ? "close-circle"
                    : "time-outline"
                }
                size={20}
                color={
                  appointment.vetDecision === "accepted"
                    ? theme.colors.success
                    : appointment.vetDecision === "rejected"
                    ? theme.colors.error
                    : theme.colors.info
                }
              />
              <Text style={styles.sectionTitle}>Veterinarian Decision</Text>
            </View>
            <Text style={styles.decisionText}>
              Status:{" "}
              <Text style={styles.decisionStatus}>
                {appointment.vetDecision.charAt(0).toUpperCase() +
                  appointment.vetDecision.slice(1)}
              </Text>
            </Text>
            {appointment.vetNotes && (
              <View style={styles.vetNotesContainer}>
                <Text style={styles.vetNotesLabel}>Notes from Veterinarian:</Text>
                <Text style={styles.vetNotesText}>{appointment.vetNotes}</Text>
              </View>
            )}
          </Card>
        )}

        {/* Pet Information */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Stethoscope size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Pet Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pet Name</Text>
            <Text style={styles.infoValue}>{appointment.petName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Breed</Text>
            <Text style={styles.infoValue}>{appointment.petBreed}</Text>
          </View>
        </Card>

        {/* Appointment Details */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Appointment Details</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Calendar size={18} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{appointment.date}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Clock size={18} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Time</Text>
              <Text style={styles.detailValue}>{appointment.time}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Stethoscope size={18} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{appointment.type}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="person-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Veterinarian</Text>
              <Text style={styles.detailValue}>
                {appointment.veterinarian}
              </Text>
            </View>
          </View>
        </Card>

        {/* Clinic Information */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <MapPin size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Clinic Information</Text>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Ionicons
                name="business-outline"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Clinic Name</Text>
              <Text style={styles.detailValue}>{appointment.clinic}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <MapPin size={18} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Address</Text>
              <Text style={styles.detailValue}>{appointment.address}</Text>
            </View>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailIcon}>
              <Phone size={18} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{appointment.phone}</Text>
            </View>
          </View>
        </Card>

        {/* Notes */}
        {appointment.notes && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{appointment.notes}</Text>
          </Card>
        )}

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {appointment.status === "pending" && (
            <Button
              title="Cancel Appointment"
              onPress={() => {}}
              variant="outline"
              size="large"
              style={styles.actionButton}
            />
          )}
          <Button
            title="Reschedule"
            onPress={() => router.push(`/appointments/book`)}
            variant="outline"
            size="large"
            style={styles.actionButton}
          />
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => {}}
          >
            <Ionicons name="call" size={20} color={theme.colors.white} />
            <Text style={styles.callButtonText}>Call Clinic</Text>
          </TouchableOpacity>
        </View>
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
  statusContainer: {
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  statusText: {
    ...theme.typography.bodySmall,
    fontWeight: "700",
    letterSpacing: 1,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailValue: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "500",
  },
  notesText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  actionButton: {
    width: "100%",
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  callButtonText: {
    ...theme.typography.body,
    color: theme.colors.white,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    minWidth: 200,
  },
  rescheduledText: {
    ...theme.typography.bodySmall,
    color: theme.colors.info,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
    textAlign: "center",
  },
  decisionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  decisionStatus: {
    fontWeight: "600",
    color: theme.colors.text,
  },
  vetNotesContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  vetNotesLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: "500",
  },
  vetNotesText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
});


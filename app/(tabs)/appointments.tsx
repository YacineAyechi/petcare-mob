import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { appointmentService, Appointment } from "@/services/appointmentService";

const statusColors = {
  confirmed: theme.colors.success,
  pending: theme.colors.warning,
  cancelled: theme.colors.error,
  completed: theme.colors.success,
  rejected: theme.colors.error,
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AppointmentsScreen() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await appointmentService.getAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAppointments();
    }, [loadAppointments])
  );

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.dateTime);
    const now = new Date();
    if (filter === "upcoming") {
      return aptDate >= now && apt.status !== "cancelled";
    }
    if (filter === "past") {
      return aptDate < now || apt.status === "completed";
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Appointments</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/appointments/book")}
        >
          <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === "all" && styles.filterTabActive]}
          onPress={() => setFilter("all")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "all" && styles.filterTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "upcoming" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("upcoming")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "upcoming" && styles.filterTextActive,
            ]}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "past" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("past")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "past" && styles.filterTextActive,
            ]}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredAppointments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="calendar-outline"
                size={64}
                color={theme.colors.textLight}
              />
              <Text style={styles.emptyText}>No appointments found</Text>
              <Button
                title="Book Appointment"
                onPress={() => router.push("/appointments/book")}
                style={styles.emptyButton}
              />
            </View>
          ) : (
            filteredAppointments.map((appointment) => {
              const pet =
                typeof appointment.petId === "object"
                  ? appointment.petId
                  : null;
              return (
                <Card key={appointment._id} style={styles.appointmentCard}>
                  <View style={styles.appointmentHeader}>
                    <View style={styles.appointmentIcon}>
                      <Ionicons
                        name="calendar"
                        size={24}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.appointmentInfo}>
                      <View style={styles.appointmentTitleRow}>
                        <Text style={styles.appointmentPet}>
                          {pet?.name || "Pet"}
                        </Text>
                        <View
                          style={[
                            styles.statusBadge,
                            {
                              backgroundColor:
                                (statusColors[
                                  appointment.status as keyof typeof statusColors
                                ] || theme.colors.textSecondary) + "20",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusText,
                              {
                                color:
                                  statusColors[
                                    appointment.status as keyof typeof statusColors
                                  ] || theme.colors.textSecondary,
                              },
                            ]}
                          >
                            {appointment.status}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.appointmentClinic}>
                        {appointment.clinicName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {formatDate(appointment.dateTime)} at{" "}
                        {formatTime(appointment.dateTime)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {appointment.clinicAddress}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="medical-outline"
                        size={18}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {appointment.appointmentType}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.appointmentActions}>
                    <Button
                      title="View Details"
                      onPress={() =>
                        router.push(`/appointments/${appointment._id}` as any)
                      }
                      variant="outline"
                      size="small"
                      style={styles.actionButton}
                    />
                    {appointment.status === "pending" && (
                      <Button
                        title="Cancel"
                        onPress={async () => {
                          try {
                            await appointmentService.updateAppointment(
                              appointment._id,
                              { status: "cancelled" }
                            );
                            loadAppointments();
                          } catch (error) {
                            console.error(
                              "Error cancelling appointment:",
                              error
                            );
                          }
                        }}
                        variant="ghost"
                        size="small"
                        style={styles.actionButton}
                      />
                    )}
                  </View>
                </Card>
              );
            })
          )}
        </ScrollView>
      )}
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
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  addButton: {
    padding: theme.spacing.xs,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  filterTabActive: {
    backgroundColor: theme.colors.primary,
  },
  filterText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterTextActive: {
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  appointmentCard: {
    marginBottom: theme.spacing.md,
  },
  appointmentHeader: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  appointmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  appointmentPet: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  appointmentClinic: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  appointmentDetails: {
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  detailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  appointmentActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Calendar, Stethoscope } from "lucide-react-native";
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
  pending: theme.colors.warning,
  confirmed: theme.colors.success,
  accepted: theme.colors.success,
  rejected: theme.colors.error,
  cancelled: theme.colors.error,
  rescheduled: theme.colors.info,
  completed: theme.colors.success,
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

export default function VetDashboardScreen() {
  const [filter, setFilter] = useState<"all" | "pending" | "accepted">("all");
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

  const filteredRequests = appointments.filter((req) => {
    if (filter === "pending") return req.status === "pending";
    if (filter === "accepted") return req.status === "confirmed";
    return true;
  });

  const handleDecision = async (
    appointmentId: string,
    decision: "confirmed" | "rejected" | "cancelled"
  ) => {
    try {
      await appointmentService.updateAppointment(appointmentId, {
        status: decision,
      });
      loadAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Veterinarian Dashboard</Text>
          <Text style={styles.subtitle}>Manage appointments and services</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/vet/services" as any)}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={theme.colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {appointments.filter((r) => r.status === "pending").length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>
            {appointments.filter((r) => r.status === "confirmed").length}
          </Text>
          <Text style={styles.statLabel}>Confirmed</Text>
        </Card>
        <Card style={styles.statCard}>
          <Text style={styles.statNumber}>{appointments.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </Card>
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
            filter === "pending" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("pending")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "pending" && styles.filterTextActive,
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTab,
            filter === "accepted" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("accepted")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "accepted" && styles.filterTextActive,
            ]}
          >
            Accepted
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
          <Text style={styles.sectionTitle}>Incoming Appointment Requests</Text>
          {filteredRequests.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No appointments found</Text>
            </View>
          ) : (
            filteredRequests.map((request) => {
              const pet =
                typeof request.petId === "object" ? request.petId : null;
              const owner =
                typeof request.ownerId === "object" ? request.ownerId : null;
              return (
                <Card key={request._id} style={styles.requestCard}>
                  <View style={styles.requestHeader}>
                    <View style={styles.requestIcon}>
                      <Stethoscope size={24} color={theme.colors.primary} />
                    </View>
                    <View style={styles.requestInfo}>
                      <Text style={styles.petName}>
                        {pet?.name || "Pet"} - {pet?.breed || ""}
                      </Text>
                      <Text style={styles.ownerName}>
                        Owner: {owner?.fullName || "Unknown"}
                      </Text>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              (statusColors[
                                request.status as keyof typeof statusColors
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
                                  request.status as keyof typeof statusColors
                                ] || theme.colors.textSecondary,
                            },
                          ]}
                        >
                          {request.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.requestDetails}>
                    <View style={styles.detailRow}>
                      <Calendar size={16} color={theme.colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {formatDate(request.dateTime)} at{" "}
                        {formatTime(request.dateTime)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Stethoscope
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {request.appointmentType}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.detailText}>
                        {request.clinicName} - {request.clinicAddress}
                      </Text>
                    </View>
                    {request.notes && (
                      <View style={styles.notesContainer}>
                        <Text style={styles.notesLabel}>Notes:</Text>
                        <Text style={styles.notesText}>{request.notes}</Text>
                      </View>
                    )}
                  </View>

                  {request.status === "pending" && (
                    <View style={styles.requestActions}>
                      <Button
                        title="Accept"
                        onPress={() => handleDecision(request._id, "confirmed")}
                        size="small"
                        variant="primary"
                        style={styles.actionButton}
                      />
                      <Button
                        title="Reject"
                        onPress={() => handleDecision(request._id, "rejected")}
                        size="small"
                        variant="outline"
                        style={StyleSheet.flatten([
                          styles.actionButton,
                          { borderColor: theme.colors.error },
                        ])}
                      />
                    </View>
                  )}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  subtitle: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.md,
  },
  statNumber: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
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
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  requestCard: {
    marginBottom: theme.spacing.md,
  },
  requestHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  requestIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  requestInfo: {
    flex: 1,
  },
  petName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  ownerName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
  requestDetails: {
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  detailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  notesContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
  },
  notesLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  requestActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
});

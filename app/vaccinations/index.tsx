import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Calendar, Shield } from "lucide-react-native";
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
import { vaccinationService, Vaccination } from "@/services/vaccinationService";
import { petService, Pet } from "@/services/petService";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function VaccinationsScreen() {
  const [filter, setFilter] = useState<"all" | "completed" | "upcoming">("all");
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [pets, setPets] = useState<Record<string, Pet>>({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const petsData = await petService.getAllPets();
      const petsMap: Record<string, Pet> = {};
      petsData.forEach((pet) => {
        petsMap[pet._id] = pet;
      });
      setPets(petsMap);

      // Load all vaccinations for all pets
      const allVaccinations: Vaccination[] = [];
      for (const pet of petsData) {
        try {
          const petVaccinations = await vaccinationService.getPetVaccinations(
            pet._id
          );
          allVaccinations.push(...petVaccinations);
        } catch (error) {
          console.error(
            `Error loading vaccinations for pet ${pet._id}:`,
            error
          );
        }
      }
      setVaccinations(allVaccinations);
    } catch (error) {
      console.error("Error loading vaccinations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const filteredVaccinations = vaccinations.filter((vac) => {
    if (filter === "completed") {
      return vac.date && new Date(vac.date) <= new Date();
    }
    if (filter === "upcoming") {
      return vac.nextDueDate && new Date(vac.nextDueDate) >= new Date();
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Vaccination Records</Text>
        <TouchableOpacity
          onPress={() => router.push("/vaccinations/add" as any)}
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
            filter === "completed" && styles.filterTabActive,
          ]}
          onPress={() => setFilter("completed")}
        >
          <Text
            style={[
              styles.filterText,
              filter === "completed" && styles.filterTextActive,
            ]}
          >
            Completed
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
          {filteredVaccinations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Shield size={64} color={theme.colors.textLight} />
              <Text style={styles.emptyText}>No vaccinations found</Text>
              <Button
                title="Add Vaccination"
                onPress={() => router.push("/vaccinations/add" as any)}
                style={styles.emptyButton}
              />
            </View>
          ) : (
            filteredVaccinations.map((vaccination) => {
              const pet = pets[vaccination.pet];
              const isCompleted =
                vaccination.date && new Date(vaccination.date) <= new Date();
              return (
                <Card key={vaccination._id} style={styles.vaccinationCard}>
                  <View style={styles.vaccinationHeader}>
                    <View
                      style={[
                        styles.vaccinationIcon,
                        {
                          backgroundColor: isCompleted
                            ? theme.colors.success + "20"
                            : theme.colors.warning + "20",
                        },
                      ]}
                    >
                      <Shield
                        size={24}
                        color={
                          isCompleted
                            ? theme.colors.success
                            : theme.colors.warning
                        }
                      />
                    </View>
                    <View style={styles.vaccinationInfo}>
                      <Text style={styles.vaccineName}>
                        {vaccination.vaccineName}
                      </Text>
                      <Text style={styles.petName}>{pet?.name || "Pet"}</Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isCompleted
                            ? theme.colors.success + "20"
                            : theme.colors.warning + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color: isCompleted
                              ? theme.colors.success
                              : theme.colors.warning,
                          },
                        ]}
                      >
                        {isCompleted ? "Completed" : "Due"}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.vaccinationDetails}>
                    {vaccination.date && (
                      <View style={styles.detailRow}>
                        <Calendar
                          size={16}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.detailLabel}>Date:</Text>
                        <Text style={styles.detailValue}>
                          {formatDate(vaccination.date)}
                        </Text>
                      </View>
                    )}
                    {vaccination.nextDueDate && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.detailLabel}>Next Due:</Text>
                        <Text
                          style={[
                            styles.detailValue,
                            !isCompleted && styles.detailValueWarning,
                          ]}
                        >
                          {formatDate(vaccination.nextDueDate)}
                        </Text>
                      </View>
                    )}
                    {vaccination.veterinarian && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="person-outline"
                          size={16}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.detailLabel}>Vet:</Text>
                        <Text style={styles.detailValue}>
                          {vaccination.veterinarian}
                        </Text>
                      </View>
                    )}
                    {vaccination.notes && (
                      <View style={styles.detailRow}>
                        <Ionicons
                          name="document-text-outline"
                          size={16}
                          color={theme.colors.textSecondary}
                        />
                        <Text style={styles.detailLabel}>Notes:</Text>
                        <Text style={styles.detailValue}>
                          {vaccination.notes}
                        </Text>
                      </View>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
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
  vaccinationCard: {
    marginBottom: theme.spacing.md,
  },
  vaccinationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  vaccinationIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  vaccinationInfo: {
    flex: 1,
  },
  vaccineName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  petName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
  vaccinationDetails: {
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
  detailLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: "500",
    flex: 1,
  },
  detailValueWarning: {
    color: theme.colors.warning,
    fontWeight: "600",
  },
  vaccinationActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
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

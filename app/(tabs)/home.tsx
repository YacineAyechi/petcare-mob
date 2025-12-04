import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { Appointment, appointmentService } from "@/services/appointmentService";
import { Pet, petService } from "@/services/petService";
import { Vaccination, vaccinationService } from "@/services/vaccinationService";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Cat, Dog, Hand } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const getPetIcon = (species: string) => {
  return species.toLowerCase().includes("cat") ? Cat : Dog;
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

export default function HomeScreen() {
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [petsData, appointmentsData] = await Promise.all([
        petService.getAllPets(),
        appointmentService.getAllAppointments(),
      ]);

      setPets(petsData);
      setAppointments(appointmentsData);

      // Get vaccinations for all pets
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
      console.error("Error loading home data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // Filter upcoming appointments
  const upcomingAppointments = appointments
    .filter((apt) => {
      const aptDate = new Date(apt.dateTime);
      return aptDate >= new Date() && apt.status !== "cancelled";
    })
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    .slice(0, 2);

  // Filter upcoming vaccinations
  const upcomingVaccinations = vaccinations
    .filter((vac) => {
      if (!vac.nextDueDate) return false;
      const dueDate = new Date(vac.nextDueDate);
      return dueDate >= new Date();
    })
    .sort((a, b) => {
      const dateA = a.nextDueDate ? new Date(a.nextDueDate).getTime() : 0;
      const dateB = b.nextDueDate ? new Date(b.nextDueDate).getTime() : 0;
      return dateA - dateB;
    })
    .slice(0, 2);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Good Morning! </Text>
              <Hand size={24} color={theme.colors.text} />
            </View>
            <Text style={styles.userName}>
              {user?.fullName || "Welcome back"}
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.colors.text}
              />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/settings")}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{pets.length}</Text>
            <Text style={styles.statLabel}>Pets</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingAppointments.length}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statNumber}>{upcomingVaccinations.length}</Text>
            <Text style={styles.statLabel}>Vaccines</Text>
          </Card>
        </View>

        {/* Pet Overview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Pets</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/pets")}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.petsScroll}
          >
            {pets.length === 0 ? (
              <View style={styles.emptySection}>
                <Text style={styles.emptyText}>No pets yet</Text>
                <TouchableOpacity
                  onPress={() => router.push("/pets/add" as any)}
                >
                  <Text style={styles.addPetLink}>Add your first pet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              pets.slice(0, 3).map((pet) => {
                const PetIcon = getPetIcon(pet.species);
                return (
                  <TouchableOpacity
                    key={pet._id}
                    onPress={() => router.push(`/pets/${pet._id}` as any)}
                  >
                    <Card style={styles.petCard}>
                      <View style={styles.petPhotoContainer}>
                        {pet.photo ? (
                          <Image
                            source={{ uri: pet.photo }}
                            style={styles.petPhoto}
                          />
                        ) : (
                          <View style={styles.petPhotoPlaceholder}>
                            <PetIcon size={32} color={theme.colors.primary} />
                          </View>
                        )}
                      </View>
                      <Text style={styles.petCardName}>{pet.name}</Text>
                      <Text style={styles.petCardBreed}>{pet.breed}</Text>
                      <Text style={styles.petCardAge}>
                        {pet.age} {pet.age === 1 ? "year" : "years"} old
                      </Text>
                    </Card>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/appointments")}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingAppointments.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No upcoming appointments</Text>
            </View>
          ) : (
            upcomingAppointments.map((appointment) => {
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
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={styles.appointmentInfo}>
                      <Text style={styles.appointmentPet}>
                        {pet?.name || "Pet"}
                      </Text>
                      <Text style={styles.appointmentClinic}>
                        {appointment.clinicName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <View style={styles.appointmentDetail}>
                      <Ionicons
                        name="time-outline"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.appointmentText}>
                        {formatDate(appointment.dateTime)} at{" "}
                        {formatTime(appointment.dateTime)}
                      </Text>
                    </View>
                    <View style={styles.appointmentDetail}>
                      <Ionicons
                        name="medical-outline"
                        size={16}
                        color={theme.colors.textSecondary}
                      />
                      <Text style={styles.appointmentText}>
                        {appointment.appointmentType}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
        </View>

        {/* Vaccination Reminders */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Vaccination Reminders</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {upcomingVaccinations.length === 0 ? (
            <View style={styles.emptySection}>
              <Text style={styles.emptyText}>No upcoming vaccinations</Text>
            </View>
          ) : (
            upcomingVaccinations.map((vaccine) => {
              const pet = pets.find((p) => p._id === vaccine.pet);
              return (
                <Card key={vaccine._id} style={styles.vaccineCard}>
                  <View style={styles.vaccineHeader}>
                    <View style={styles.vaccineIcon}>
                      <Ionicons
                        name="shield-checkmark"
                        size={20}
                        color={theme.colors.secondary}
                      />
                    </View>
                    <View style={styles.vaccineInfo}>
                      <Text style={styles.vaccinePet}>
                        {pet?.name || "Pet"}
                      </Text>
                      <Text style={styles.vaccineName}>
                        {vaccine.vaccineName}
                      </Text>
                    </View>
                    <View style={styles.vaccineDate}>
                      <Text style={styles.vaccineDateText}>
                        Due:{" "}
                        {vaccine.nextDueDate
                          ? formatDate(vaccine.nextDueDate)
                          : "N/A"}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  greetingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  greeting: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  userName: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  headerButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  headerButton: {
    position: "relative",
    padding: theme.spacing.sm,
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.error,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: theme.spacing.xl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
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
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  seeAll: {
    ...theme.typography.bodySmall,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  appointmentCard: {
    marginBottom: theme.spacing.md,
  },
  appointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  appointmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentPet: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  appointmentClinic: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  appointmentDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  appointmentDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  appointmentText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  vaccineCard: {
    marginBottom: theme.spacing.md,
  },
  vaccineHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  vaccineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.secondary + "20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  vaccineInfo: {
    flex: 1,
  },
  vaccinePet: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  vaccineName: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  vaccineDate: {
    alignItems: "flex-end",
  },
  vaccineDateText: {
    ...theme.typography.bodySmall,
    color: theme.colors.warning,
    fontWeight: "600",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    textAlign: "center",
  },
  petsScroll: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
  petCard: {
    width: 140,
    alignItems: "center",
    padding: theme.spacing.md,
    marginRight: theme.spacing.sm,
  },
  petPhotoContainer: {
    marginBottom: theme.spacing.sm,
  },
  petPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
  },
  petPhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  petCardName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  petCardBreed: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    textAlign: "center",
  },
  petCardAge: {
    ...theme.typography.caption,
    color: theme.colors.textLight,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptySection: {
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  addPetLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
    fontWeight: "600",
  },
});

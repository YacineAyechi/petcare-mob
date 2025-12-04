import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar, Cat, Dog, Shield, Stethoscope } from "lucide-react-native";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - in real app, fetch by ID
const pets = [
  {
    id: "1",
    name: "Max",
    breed: "Golden Retriever",
    species: "Dog",
    age: 3,
    birthdate: "2021-03-15",
    gender: "Male",
    photo: null,
    Icon: Dog,
    medicalHistory: [
      {
        id: "1",
        type: "Vaccination",
        title: "Rabies Vaccine",
        date: "2023-12-01",
        description: "Annual rabies vaccination",
      },
      {
        id: "2",
        type: "Check-up",
        title: "Annual Check-up",
        date: "2023-10-15",
        description: "Regular health examination",
      },
      {
        id: "3",
        type: "Treatment",
        title: "Dental Cleaning",
        date: "2023-08-20",
        description: "Professional dental cleaning",
      },
    ],
    vaccinations: [
      {
        id: "1",
        name: "Rabies",
        date: "2023-12-01",
        nextDue: "2024-12-01",
        completed: true,
      },
      {
        id: "2",
        name: "DHPP",
        date: "2023-11-15",
        nextDue: "2024-11-15",
        completed: true,
      },
      {
        id: "3",
        name: "Bordetella",
        date: "2023-10-01",
        nextDue: "2024-01-20",
        completed: false,
      },
    ],
    allergies: ["Pollen", "Certain flea treatments"],
    notes: "Max is a friendly and active dog. He loves playing fetch and going for walks.",
  },
  {
    id: "2",
    name: "Luna",
    breed: "Persian Cat",
    species: "Cat",
    age: 2,
    birthdate: "2022-05-10",
    gender: "Female",
    photo: null,
    Icon: Cat,
    medicalHistory: [
      {
        id: "1",
        type: "Vaccination",
        title: "FVRCP Vaccine",
        date: "2023-11-20",
        description: "Annual FVRCP vaccination",
      },
    ],
    vaccinations: [
      {
        id: "1",
        name: "FVRCP",
        date: "2023-11-20",
        nextDue: "2024-11-20",
        completed: true,
      },
      {
        id: "2",
        name: "Rabies",
        date: "2023-11-20",
        nextDue: "2024-01-25",
        completed: false,
      },
    ],
    allergies: [],
    notes: "Luna is a calm and friendly cat.",
  },
];

export default function PetProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pet = pets.find((p) => p.id === id);

  if (!pet) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Pet Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Pet not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const PetIcon = pet.Icon;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{pet.name}</Text>
        <TouchableOpacity
          onPress={() => router.push(`/pets/edit/${pet.id}` as any)}
        >
          <Ionicons name="create-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pet Photo & Basic Info */}
        <Card style={styles.profileCard}>
          <View style={styles.photoContainer}>
            {pet.photo ? (
              <Image source={{ uri: pet.photo }} style={styles.petPhoto} />
            ) : (
              <View style={styles.petPhotoPlaceholder}>
                <PetIcon size={48} color={theme.colors.primary} />
              </View>
            )}
          </View>
          <Text style={styles.petName}>{pet.name}</Text>
          <Text style={styles.petBreed}>{pet.breed}</Text>
          <View style={styles.basicInfo}>
            <View style={styles.infoItem}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.infoText}>{pet.age} years old</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons
                name="male-female-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.infoText}>{pet.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <PetIcon size={16} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>{pet.species}</Text>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() =>
              router.push({
                pathname: "/appointments/book",
                params: { petId: pet.id },
              } as any)
            }
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.primary + "20" }]}>
              <Calendar size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickAction}
            onPress={() => router.push("/vaccinations")}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: theme.colors.secondary + "20" }]}>
              <Shield size={20} color={theme.colors.secondary} />
            </View>
            <Text style={styles.quickActionText}>Vaccinations</Text>
          </TouchableOpacity>
        </View>

        {/* Medical History Timeline */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Stethoscope size={20} color={theme.colors.primary} />
            <Text style={styles.sectionTitle}>Medical Timeline</Text>
          </View>
          {pet.medicalHistory.length > 0 ? (
            <View style={styles.timeline}>
              {pet.medicalHistory.map((event, index) => (
                <View key={event.id} style={styles.timelineItem}>
                  <View style={styles.timelineDot} />
                  {index < pet.medicalHistory.length - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text style={styles.timelineTitle}>{event.title}</Text>
                      <Text style={styles.timelineDate}>{event.date}</Text>
                    </View>
                    <View style={styles.timelineType}>
                      <Text style={styles.timelineTypeText}>{event.type}</Text>
                    </View>
                    <Text style={styles.timelineDescription}>
                      {event.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No medical history recorded</Text>
          )}
        </Card>

        {/* Vaccination Records */}
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color={theme.colors.secondary} />
            <Text style={styles.sectionTitle}>Vaccination Records</Text>
          </View>
          {pet.vaccinations.length > 0 ? (
            <View style={styles.vaccinationList}>
              {pet.vaccinations.map((vaccine) => (
                <View key={vaccine.id} style={styles.vaccinationItem}>
                  <View style={styles.vaccinationHeader}>
                    <Text style={styles.vaccinationName}>{vaccine.name}</Text>
                    <View
                      style={[
                        styles.vaccinationStatus,
                        {
                          backgroundColor: vaccine.completed
                            ? theme.colors.success + "20"
                            : theme.colors.warning + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.vaccinationStatusText,
                          {
                            color: vaccine.completed
                              ? theme.colors.success
                              : theme.colors.warning,
                          },
                        ]}
                      >
                        {vaccine.completed ? "Completed" : "Due"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.vaccinationDetails}>
                    <View style={styles.vaccinationDetail}>
                      <Text style={styles.vaccinationLabel}>Last Date:</Text>
                      <Text style={styles.vaccinationValue}>{vaccine.date}</Text>
                    </View>
                    <View style={styles.vaccinationDetail}>
                      <Text style={styles.vaccinationLabel}>Next Due:</Text>
                      <Text
                        style={[
                          styles.vaccinationValue,
                          !vaccine.completed && styles.vaccinationValueWarning,
                        ]}
                      >
                        {vaccine.nextDue}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyText}>No vaccination records</Text>
          )}
          <Button
            title="View All Vaccinations"
            onPress={() => router.push("/vaccinations")}
            variant="outline"
            size="small"
            style={styles.viewAllButton}
          />
        </Card>

        {/* Allergies */}
        {pet.allergies.length > 0 && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="warning-outline"
                size={20}
                color={theme.colors.warning}
              />
              <Text style={styles.sectionTitle}>Allergies</Text>
            </View>
            <View style={styles.allergiesList}>
              {pet.allergies.map((allergy, index) => (
                <View key={index} style={styles.allergyTag}>
                  <Text style={styles.allergyText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Notes */}
        {pet.notes && (
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Notes</Text>
            </View>
            <Text style={styles.notesText}>{pet.notes}</Text>
          </Card>
        )}

        {/* Edit & Delete Actions */}
        <View style={styles.actionsContainer}>
          <Button
            title="Edit Pet Profile"
            onPress={() => router.push(`/pets/edit/${pet.id}` as any)}
            variant="outline"
            size="large"
            style={styles.actionButton}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              // Handle delete confirmation
            }}
          >
            <Ionicons name="trash-outline" size={20} color={theme.colors.error} />
            <Text style={styles.deleteButtonText}>Delete Pet Profile</Text>
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
  profileCard: {
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  photoContainer: {
    marginBottom: theme.spacing.md,
  },
  petPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
  },
  petPhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  petName: {
    ...theme.typography.h1,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  petBreed: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  basicInfo: {
    flexDirection: "row",
    gap: theme.spacing.md,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  infoText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  quickActions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.sm,
  },
  quickActionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: "500",
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
  timeline: {
    position: "relative",
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: theme.spacing.lg,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
    zIndex: 1,
  },
  timelineLine: {
    position: "absolute",
    left: 5,
    top: 20,
    width: 2,
    height: "100%",
    backgroundColor: theme.colors.border,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.md,
  },
  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  timelineTitle: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  timelineDate: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  timelineType: {
    alignSelf: "flex-start",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + "20",
    marginBottom: theme.spacing.xs,
  },
  timelineTypeText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  timelineDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  vaccinationList: {
    gap: theme.spacing.md,
  },
  vaccinationItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  vaccinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  vaccinationName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  vaccinationStatus: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  vaccinationStatusText: {
    ...theme.typography.caption,
    fontWeight: "600",
  },
  vaccinationDetails: {
    gap: theme.spacing.xs,
  },
  vaccinationDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vaccinationLabel: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  vaccinationValue: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: "500",
  },
  vaccinationValueWarning: {
    color: theme.colors.warning,
  },
  viewAllButton: {
    marginTop: theme.spacing.sm,
  },
  allergiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  allergyTag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.warning + "20",
  },
  allergyText: {
    ...theme.typography.bodySmall,
    color: theme.colors.warning,
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
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.error,
    gap: theme.spacing.sm,
  },
  deleteButtonText: {
    ...theme.typography.body,
    color: theme.colors.error,
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
    textAlign: "center",
  },
  backButton: {
    minWidth: 200,
  },
});



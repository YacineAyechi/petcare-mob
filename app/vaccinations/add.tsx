import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data
const pets = [
  { id: "1", name: "Max", breed: "Golden Retriever" },
  { id: "2", name: "Luna", breed: "Persian Cat" },
  { id: "3", name: "Charlie", breed: "Beagle" },
];

const vaccineTypes = [
  "Rabies",
  "DHPP",
  "Bordetella",
  "FVRCP",
  "FeLV",
  "Canine Influenza",
  "Lyme Disease",
  "Other",
];

export default function AddVaccinationScreen() {
  const [selectedPet, setSelectedPet] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [date, setDate] = useState("");
  const [nextDue, setNextDue] = useState("");
  const [clinic, setClinic] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedPet) newErrors.pet = "Please select a pet";
    if (!vaccineName.trim()) newErrors.vaccineName = "Vaccine name is required";
    if (!date.trim()) newErrors.date = "Date is required";
    if (!nextDue.trim()) newErrors.nextDue = "Next due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // In real app, save to backend
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Vaccination</Text>
        <View style={styles.placeholder} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Select Pet */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Select Pet *</Text>
            <View style={styles.optionsContainer}>
              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={[
                    styles.option,
                    selectedPet === pet.id && styles.optionActive,
                  ]}
                  onPress={() => setSelectedPet(pet.id)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selectedPet === pet.id && styles.optionTextActive,
                    ]}
                  >
                    {pet.name} ({pet.breed})
                  </Text>
                  {selectedPet === pet.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.pet && <Text style={styles.errorText}>{errors.pet}</Text>}
          </Card>

          {/* Vaccine Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Vaccine Information</Text>
            <Input
              label="Vaccine Name *"
              placeholder="Select or enter vaccine name"
              value={vaccineName}
              onChangeText={setVaccineName}
              error={errors.vaccineName}
            />
            <View style={styles.vaccineTypesContainer}>
              <Text style={styles.label}>Common Vaccines:</Text>
              <View style={styles.vaccineTypes}>
                {vaccineTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.vaccineTypeChip,
                      vaccineName === type && styles.vaccineTypeChipActive,
                    ]}
                    onPress={() => setVaccineName(type)}
                  >
                    <Text
                      style={[
                        styles.vaccineTypeText,
                        vaccineName === type && styles.vaccineTypeTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <Input
              label="Date Given *"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              error={errors.date}
            />
            <Input
              label="Next Due Date *"
              placeholder="YYYY-MM-DD"
              value={nextDue}
              onChangeText={setNextDue}
              error={errors.nextDue}
            />
          </Card>

          {/* Clinic Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Clinic Information</Text>
            <Input
              label="Clinic Name"
              placeholder="Enter clinic name"
              value={clinic}
              onChangeText={setClinic}
            />
            <Input
              label="Veterinarian"
              placeholder="Enter veterinarian name"
              value={veterinarian}
              onChangeText={setVeterinarian}
            />
          </Card>

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Input
              placeholder="Any additional notes about the vaccination..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
            />
          </Card>

          <Button
            title="Save Vaccination Record"
            onPress={handleSave}
            size="large"
            style={styles.saveButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
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
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  optionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  optionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  vaccineTypesContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: "500",
  },
  vaccineTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  vaccineTypeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  vaccineTypeChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
  },
  vaccineTypeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
  },
  vaccineTypeTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  saveButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});



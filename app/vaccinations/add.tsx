import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { petService, Pet } from "@/services/petService";
import { vaccinationService } from "@/services/vaccinationService";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

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
  const [pets, setPets] = useState<Pet[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [vaccinationDate, setVaccinationDate] = useState<Date | null>(null);
  const [nextDueDate, setNextDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showNextDuePicker, setShowNextDuePicker] = useState(false);
  const [clinic, setClinic] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setPetsLoading(true);
        const petsData = await petService.getAllPets();
        setPets(petsData);
      } catch (error) {
        console.error("Error fetching pets:", error);
        setErrors((prev) => ({ ...prev, pets: "Failed to load pets" }));
      } finally {
        setPetsLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setVaccinationDate(selectedDate);
      setErrors((prev) => ({ ...prev, date: "" }));
    }
  };

  const handleNextDueChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowNextDuePicker(false);
    if (selectedDate) {
      setNextDueDate(selectedDate);
      setErrors((prev) => ({ ...prev, nextDue: "" }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedPet) newErrors.pet = "Please select a pet";
    if (!vaccineName.trim()) newErrors.vaccineName = "Vaccine name is required";
    if (!vaccinationDate) newErrors.date = "Vaccination date is required";
    if (!nextDueDate) newErrors.nextDue = "Next due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await vaccinationService.createVaccination(selectedPet, {
        pet: selectedPet,
        vaccineName: vaccineName.trim(),
        date: vaccinationDate!.toISOString(),
        nextDueDate: nextDueDate!.toISOString(),
        veterinarian: veterinarian.trim() || undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Error creating vaccination:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Unable to save vaccination right now. Please try again.",
      }));
    } finally {
      setSaving(false);
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
            {petsLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading your pets...</Text>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {pets.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No pets found</Text>
                    <Text style={styles.emptySubtext}>
                      Add a pet first to create vaccination records
                    </Text>
                  </View>
                ) : (
                  pets.map((pet) => (
                    <TouchableOpacity
                      key={pet._id}
                      style={[
                        styles.option,
                        selectedPet === pet._id && styles.optionActive,
                      ]}
                      onPress={() => setSelectedPet(pet._id)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedPet === pet._id && styles.optionTextActive,
                        ]}
                      >
                        {pet.name} ({pet.breed})
                      </Text>
                      {selectedPet === pet._id && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={theme.colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
            {errors.pet && <Text style={styles.errorText}>{errors.pet}</Text>}
            {errors.pets && <Text style={styles.errorText}>{errors.pets}</Text>}
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date Given *</Text>
              <TouchableOpacity
                style={[styles.dateInput, errors.date && styles.inputError]}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    !vaccinationDate && styles.dateInputPlaceholder,
                  ]}
                >
                  {vaccinationDate
                    ? formatDate(vaccinationDate)
                    : "Select vaccination date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
              {errors.date && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Next Due Date *</Text>
              <TouchableOpacity
                style={[styles.dateInput, errors.nextDue && styles.inputError]}
                onPress={() => setShowNextDuePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.dateInputText,
                    !nextDueDate && styles.dateInputPlaceholder,
                  ]}
                >
                  {nextDueDate
                    ? formatDate(nextDueDate)
                    : "Select next due date"}
                </Text>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
              {errors.nextDue && (
                <Text style={styles.errorText}>{errors.nextDue}</Text>
              )}
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={vaccinationDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}

            {showNextDuePicker && (
              <DateTimePicker
                value={nextDueDate || vaccinationDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={vaccinationDate || new Date()}
                onChange={handleNextDueChange}
              />
            )}
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
            title={saving ? "Saving Vaccination..." : "Save Vaccination Record"}
            onPress={handleSave}
            size="large"
            disabled={saving}
            style={styles.saveButton}
          />
          {errors.form && <Text style={styles.errorText}>{errors.form}</Text>}
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
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  dateInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputText: {
    color: theme.colors.text,
    flex: 1,
  },
  dateInputPlaceholder: {
    color: theme.colors.textLight,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing.xl,
  },
  emptyText: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});

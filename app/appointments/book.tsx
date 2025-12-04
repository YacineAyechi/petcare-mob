import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar, Clock, MapPin, Stethoscope } from "lucide-react-native";
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

const clinics = [
  { id: "1", name: "VetCare Clinic", address: "123 Main St, City" },
  { id: "2", name: "Animal Hospital", address: "456 Oak Ave, City" },
  { id: "3", name: "Pet Wellness Center", address: "789 Pine Rd, City" },
];

const appointmentTypes = [
  "Consultation",
  "Vaccination",
  "Check-up",
  "Grooming",
  "Emergency",
  "Surgery",
];

export default function BookAppointmentScreen() {
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedClinic, setSelectedClinic] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedPet) newErrors.pet = "Please select a pet";
    if (!selectedClinic) newErrors.clinic = "Please select a clinic";
    if (!selectedType) newErrors.type = "Please select appointment type";
    if (!date) newErrors.date = "Please select a date";
    if (!time) newErrors.time = "Please select a time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = () => {
    if (validate()) {
      // Navigate back to appointments list
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Book Appointment</Text>
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
            <Text style={styles.sectionTitle}>Select Pet</Text>
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
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedPet === pet.id && styles.optionTextActive,
                      ]}
                    >
                      {pet.name}
                    </Text>
                    <Text
                      style={[
                        styles.optionSubtext,
                        selectedPet === pet.id && styles.optionSubtextActive,
                      ]}
                    >
                      {pet.breed}
                    </Text>
                  </View>
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

          {/* Select Clinic */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Select Clinic</Text>
            <View style={styles.optionsContainer}>
              {clinics.map((clinic) => (
                <TouchableOpacity
                  key={clinic.id}
                  style={[
                    styles.option,
                    selectedClinic === clinic.id && styles.optionActive,
                  ]}
                  onPress={() => setSelectedClinic(clinic.id)}
                >
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        selectedClinic === clinic.id && styles.optionTextActive,
                      ]}
                    >
                      {clinic.name}
                    </Text>
                    <View style={styles.optionRow}>
                      <MapPin size={14} color={theme.colors.textSecondary} />
                      <Text
                        style={[
                          styles.optionSubtext,
                          selectedClinic === clinic.id &&
                            styles.optionSubtextActive,
                        ]}
                      >
                        {clinic.address}
                      </Text>
                    </View>
                  </View>
                  {selectedClinic === clinic.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.clinic && (
              <Text style={styles.errorText}>{errors.clinic}</Text>
            )}
          </Card>

          {/* Appointment Type */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Appointment Type</Text>
            <View style={styles.typeContainer}>
              {appointmentTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeChip,
                    selectedType === type && styles.typeChipActive,
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Stethoscope
                    size={16}
                    color={
                      selectedType === type
                        ? theme.colors.white
                        : theme.colors.primary
                    }
                  />
                  <Text
                    style={[
                      styles.typeChipText,
                      selectedType === type && styles.typeChipTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.type && <Text style={styles.errorText}>{errors.type}</Text>}
          </Card>

          {/* Date & Time */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.datetimeRow}>
              <View style={styles.datetimeInput}>
                <Calendar size={20} color={theme.colors.primary} />
                <Input
                  placeholder="Select date"
                  value={date}
                  onChangeText={setDate}
                  error={errors.date}
                  style={styles.datetimeField}
                />
              </View>
              <View style={styles.datetimeInput}>
                <Clock size={20} color={theme.colors.primary} />
                <Input
                  placeholder="Select time"
                  value={time}
                  onChangeText={setTime}
                  error={errors.time}
                  style={styles.datetimeField}
                />
              </View>
            </View>
          </Card>

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <Input
              placeholder="Any special instructions or concerns..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </Card>

          <Button
            title="Book Appointment"
            onPress={handleBook}
            size="large"
            style={styles.bookButton}
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
  optionContent: {
    flex: 1,
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  optionTextActive: {
    color: theme.colors.primary,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  optionSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  optionSubtextActive: {
    color: theme.colors.primary,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.xs,
  },
  typeChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary,
  },
  typeChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: "500",
  },
  typeChipTextActive: {
    color: theme.colors.white,
  },
  datetimeRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  datetimeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  datetimeField: {
    flex: 1,
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  errorText: {
    ...theme.typography.caption,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  bookButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});


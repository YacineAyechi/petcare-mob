import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Cat, Dog } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const speciesOptions = [
  { id: "dog", name: "Dog", Icon: Dog },
  { id: "cat", name: "Cat", Icon: Cat },
  { id: "bird", name: "Bird", Icon: Dog }, // Placeholder
  { id: "other", name: "Other", Icon: Dog }, // Placeholder
];

const genderOptions = ["Male", "Female"];

export default function AddPetScreen() {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [allergies, setAllergies] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!species) newErrors.species = "Species is required";
    if (!breed.trim()) newErrors.breed = "Breed is required";
    if (!gender) newErrors.gender = "Gender is required";
    if (!birthdate.trim()) newErrors.birthdate = "Birthdate is required";
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
        <Text style={styles.title}>Add New Pet</Text>
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
          {/* Pet Photo Upload */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Pet Photo</Text>
            <TouchableOpacity style={styles.photoUpload}>
              <Ionicons
                name="camera-outline"
                size={32}
                color={theme.colors.primary}
              />
              <Text style={styles.photoUploadText}>Tap to add photo</Text>
            </TouchableOpacity>
          </Card>

          {/* Basic Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Input
              label="Pet Name *"
              placeholder="Enter pet name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <Input
              label="Breed *"
              placeholder="Enter breed"
              value={breed}
              onChangeText={setBreed}
              error={errors.breed}
            />
            <Input
              label="Birthdate *"
              placeholder="YYYY-MM-DD"
              value={birthdate}
              onChangeText={setBirthdate}
              error={errors.birthdate}
            />
          </Card>

          {/* Species Selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Species *</Text>
            <View style={styles.optionsGrid}>
              {speciesOptions.map((option) => {
                const OptionIcon = option.Icon;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionCard,
                      species === option.id && styles.optionCardActive,
                    ]}
                    onPress={() => setSpecies(option.id)}
                  >
                    <OptionIcon
                      size={32}
                      color={
                        species === option.id
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.optionText,
                        species === option.id && styles.optionTextActive,
                      ]}
                    >
                      {option.name}
                    </Text>
                    {species === option.id && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={theme.colors.primary}
                        style={styles.checkmark}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.species && (
              <Text style={styles.errorText}>{errors.species}</Text>
            )}
          </Card>

          {/* Gender Selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Gender *</Text>
            <View style={styles.optionsRow}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.genderOption,
                    gender === option && styles.genderOptionActive,
                  ]}
                  onPress={() => setGender(option)}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      gender === option && styles.genderOptionTextActive,
                    ]}
                  >
                    {option}
                  </Text>
                  {gender === option && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {errors.gender && (
              <Text style={styles.errorText}>{errors.gender}</Text>
            )}
          </Card>

          {/* Medical Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Medical Information</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Allergies</Text>
              <TextInput
                style={styles.textArea}
                placeholder="List any known allergies (separated by commas)"
                value={allergies}
                onChangeText={setAllergies}
                multiline
                numberOfLines={3}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>
          </Card>

          {/* Notes */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Notes</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Any additional information about your pet..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                placeholderTextColor={theme.colors.textLight}
              />
            </View>
          </Card>

          {/* Save Button */}
          <Button
            title="Save Pet Profile"
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
  photoUpload: {
    height: 150,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  photoUploadText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  optionCard: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    padding: theme.spacing.md,
    position: "relative",
  },
  optionCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  optionText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  optionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  checkmark: {
    position: "absolute",
    top: theme.spacing.xs,
    right: theme.spacing.xs,
  },
  optionsRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  genderOption: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
  },
  genderOptionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  genderOptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
  },
  genderOptionTextActive: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: "500",
  },
  textArea: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: "top",
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

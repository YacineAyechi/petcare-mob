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
import { serviceService } from "@/services/serviceService";

const categories = [
  "consultation",
  "vaccination",
  "grooming",
  "surgery",
  "follow-up",
  "other",
];

export default function AddServiceScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Service name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price.trim()) newErrors.price = "Price is required";
    if (!durationMinutes.trim()) newErrors.durationMinutes = "Duration is required";
    if (!category) newErrors.category = "Category is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!phone.trim()) newErrors.phone = "Phone is required";

    // Validate price is a positive number
    const priceNum = parseFloat(price);
    if (price && (isNaN(priceNum) || priceNum <= 0)) {
      newErrors.price = "Price must be a positive number";
    }

    // Validate duration is a positive number
    const durationNum = parseInt(durationMinutes);
    if (durationMinutes && (isNaN(durationNum) || durationNum <= 0)) {
      newErrors.durationMinutes = "Duration must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await serviceService.createService({
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price),
        durationMinutes: parseInt(durationMinutes),
        category,
        address: address.trim(),
        phone: phone.trim(),
      });
      router.back();
    } catch (error) {
      console.error("Error creating service:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Unable to create service right now. Please try again.",
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
        <Text style={styles.title}>Add New Service</Text>
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
          {/* Basic Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <Input
              label="Service Name *"
              placeholder="Enter service name"
              value={name}
              onChangeText={setName}
              error={errors.name}
            />
            <Input
              label="Description *"
              placeholder="Describe the service"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              error={errors.description}
              style={styles.textArea}
            />
            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Input
                  label="Price ($) *"
                  placeholder="0.00"
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  error={errors.price}
                />
              </View>
              <View style={styles.halfInput}>
                <Input
                  label="Duration (min) *"
                  placeholder="30"
                  value={durationMinutes}
                  onChangeText={setDurationMinutes}
                  keyboardType="numeric"
                  error={errors.durationMinutes}
                />
              </View>
            </View>
          </Card>

          {/* Category Selection */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Category *</Text>
            <View style={styles.categoryContainer}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && styles.categoryChipActive,
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.category && <Text style={styles.errorText}>{errors.category}</Text>}
          </Card>

          {/* Contact Information */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Input
              label="Address *"
              placeholder="Clinic address"
              value={address}
              onChangeText={setAddress}
              error={errors.address}
            />
            <Input
              label="Phone Number *"
              placeholder="Contact phone number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </Card>

          <Button
            title={saving ? "Creating Service..." : "Create Service"}
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  categoryChipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "10",
  },
  categoryChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  categoryChipTextActive: {
    color: theme.colors.primary,
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

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Calendar, Clock, MapPin, Building2 } from "lucide-react-native";
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
import { appointmentService } from "@/services/appointmentService";
import { serviceService, Service } from "@/services/serviceService";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

export default function BookAppointmentScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [petsLoading, setPetsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [booking, setBooking] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPetsLoading(true);
        setServicesLoading(true);

        // Fetch pets and services in parallel
        const [petsData, servicesData] = await Promise.all([
          petService.getAllPets(),
          serviceService.getAllServices(),
        ]);

        setPets(petsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors((prev) => ({
          ...prev,
          pets: "Failed to load pets and services",
        }));
      } finally {
        setPetsLoading(false);
        setServicesLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (
    _event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(false);
    if (selectedDate) {
      // Combine with existing time if it exists, or set to start of day
      const currentDateTime = selectedDateTime || new Date();
      const newDateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        currentDateTime.getHours(),
        currentDateTime.getMinutes()
      );
      setSelectedDateTime(newDateTime);
      setErrors((prev) => ({ ...prev, date: "" }));
    }
  };

  const handleTimeChange = (
    _event: DateTimePickerEvent,
    selectedTime?: Date
  ) => {
    setShowTimePicker(false);
    if (selectedTime) {
      // Combine with existing date if it exists, or use today
      const currentDateTime = selectedDateTime || new Date();
      const newDateTime = new Date(
        currentDateTime.getFullYear(),
        currentDateTime.getMonth(),
        currentDateTime.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );
      setSelectedDateTime(newDateTime);
      setErrors((prev) => ({ ...prev, time: "" }));
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!selectedPet) newErrors.pet = "Please select a pet";
    if (!selectedService) newErrors.service = "Please select a service";
    if (!selectedDateTime) newErrors.date = "Please select a date and time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBook = async () => {
    if (!validate()) return;

    const selectedServiceData = services.find((s) => s._id === selectedService);
    if (!selectedServiceData) {
      setErrors((prev) => ({ ...prev, service: "Invalid service selected" }));
      return;
    }

    try {
      setBooking(true);
      await appointmentService.createAppointment({
        petId: selectedPet,
        serviceId: selectedService,
        clinicName: selectedServiceData.name,
        clinicAddress: selectedServiceData.address,
        appointmentType: selectedServiceData.category,
        dateTime: selectedDateTime!.toISOString(),
        notes: notes || undefined,
      });
      router.back();
    } catch (error) {
      console.error("Error booking appointment:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Unable to book appointment right now. Please try again.",
      }));
    } finally {
      setBooking(false);
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
                      Add a pet first to book appointments
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
                      <View style={styles.optionContent}>
                        <Text
                          style={[
                            styles.optionText,
                            selectedPet === pet._id && styles.optionTextActive,
                          ]}
                        >
                          {pet.name}
                        </Text>
                        <Text
                          style={[
                            styles.optionSubtext,
                            selectedPet === pet._id &&
                              styles.optionSubtextActive,
                          ]}
                        >
                          {pet.breed} • {pet.age}{" "}
                          {pet.age === 1 ? "year" : "years"} old
                        </Text>
                      </View>
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

          {/* Select Service */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Select Service</Text>
            {servicesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={styles.loadingText}>Loading services...</Text>
              </View>
            ) : (
              <View style={styles.optionsContainer}>
                {services.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No services available</Text>
                    <Text style={styles.emptySubtext}>
                      Please check back later or contact support
                    </Text>
                  </View>
                ) : (
                  services.map((service) => (
                    <TouchableOpacity
                      key={service._id}
                      style={[
                        styles.serviceCard,
                        selectedService === service._id &&
                          styles.serviceCardActive,
                      ]}
                      onPress={() => setSelectedService(service._id)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.serviceCardContent}>
                        {/* Service Header with Icon and Info */}
                        <View style={styles.serviceCardHeader}>
                          <View style={styles.serviceIcon}>
                            <Building2
                              size={24}
                              color={
                                selectedService === service._id
                                  ? theme.colors.primary
                                  : theme.colors.textSecondary
                              }
                            />
                          </View>
                          <View style={styles.serviceCardInfo}>
                            <Text
                              style={[
                                styles.serviceCardName,
                                selectedService === service._id &&
                                  styles.serviceCardNameActive,
                              ]}
                            >
                              {service.name}
                            </Text>
                            <View style={styles.serviceCardCategory}>
                              <Text
                                style={[
                                  styles.serviceCardCategoryText,
                                  selectedService === service._id &&
                                    styles.serviceCardCategoryTextActive,
                                ]}
                              >
                                {service.category.charAt(0).toUpperCase() +
                                  service.category.slice(1)}
                              </Text>
                            </View>
                          </View>
                          {selectedService === service._id && (
                            <View style={styles.selectionIndicator}>
                              <Ionicons
                                name="checkmark-circle"
                                size={24}
                                color={theme.colors.primary}
                              />
                            </View>
                          )}
                        </View>

                        {/* Service Description */}
                        <Text
                          style={[
                            styles.serviceCardDescription,
                            selectedService === service._id &&
                              styles.serviceCardDescriptionActive,
                          ]}
                          numberOfLines={2}
                        >
                          {service.description}
                        </Text>

                        {/* Service Meta Information */}
                        <View style={styles.serviceCardMeta}>
                          <View style={styles.serviceCardMetaItem}>
                            <Ionicons
                              name="time-outline"
                              size={16}
                              color={
                                selectedService === service._id
                                  ? theme.colors.primary
                                  : theme.colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.serviceCardMetaText,
                                selectedService === service._id &&
                                  styles.serviceCardMetaTextActive,
                              ]}
                            >
                              {service.durationMinutes} min
                            </Text>
                          </View>
                          <View style={styles.serviceCardMetaItem}>
                            <Ionicons
                              name="cash-outline"
                              size={16}
                              color={
                                selectedService === service._id
                                  ? theme.colors.primary
                                  : theme.colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                styles.serviceCardMetaText,
                                selectedService === service._id &&
                                  styles.serviceCardMetaTextActive,
                              ]}
                            >
                              ${service.price}
                            </Text>
                          </View>
                        </View>

                        {/* Service Location */}
                        <View style={styles.serviceCardLocation}>
                          <MapPin
                            size={14}
                            color={
                              selectedService === service._id
                                ? theme.colors.primary
                                : theme.colors.textSecondary
                            }
                          />
                          <Text
                            style={[
                              styles.serviceCardLocationText,
                              selectedService === service._id &&
                                styles.serviceCardLocationTextActive,
                            ]}
                            numberOfLines={1}
                          >
                            {service.address}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            )}
            {errors.service && (
              <Text style={styles.errorText}>{errors.service}</Text>
            )}
            {errors.pets && <Text style={styles.errorText}>{errors.pets}</Text>}
          </Card>

          {/* Date & Time */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <View style={styles.datetimeRow}>
              <View style={styles.datetimeInput}>
                <Calendar size={20} color={theme.colors.primary} />
                <TouchableOpacity
                  style={[styles.dateInput, errors.date && styles.inputError]}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateInputText,
                      !selectedDateTime && styles.dateInputPlaceholder,
                    ]}
                  >
                    {selectedDateTime
                      ? formatDate(selectedDateTime)
                      : "Select date"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.datetimeInput}>
                <Clock size={20} color={theme.colors.primary} />
                <TouchableOpacity
                  style={[styles.dateInput, errors.date && styles.inputError]}
                  onPress={() => setShowTimePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateInputText,
                      !selectedDateTime && styles.dateInputPlaceholder,
                    ]}
                  >
                    {selectedDateTime
                      ? formatTime(selectedDateTime)
                      : "Select time"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {errors.date && <Text style={styles.errorText}>{errors.date}</Text>}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDateTime || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={selectedDateTime || new Date()}
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleTimeChange}
              />
            )}
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
            title={booking ? "Booking..." : "Book Appointment"}
            onPress={handleBook}
            size="large"
            disabled={booking}
            style={styles.bookButton}
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
  serviceDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  serviceDescriptionActive: {
    color: theme.colors.primary,
  },
  serviceMeta: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  metaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
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
    flex: 1,
  },
  dateInputText: {
    color: theme.colors.text,
  },
  dateInputPlaceholder: {
    color: theme.colors.textLight,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  serviceCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  serviceCardActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "08",
  },
  serviceCardContent: {
    flex: 1,
  },
  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.sm,
  },
  serviceIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  serviceCardInfo: {
    flex: 1,
  },
  serviceCardName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  serviceCardNameActive: {
    color: theme.colors.primary,
  },
  serviceCardCategory: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary + "15",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  serviceCardCategoryText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  serviceCardCategoryTextActive: {
    color: theme.colors.primary,
  },
  selectionIndicator: {
    marginLeft: theme.spacing.sm,
  },
  serviceCardDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
  serviceCardDescriptionActive: {
    color: theme.colors.text,
  },
  serviceCardMeta: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  serviceCardMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  serviceCardMetaText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  serviceCardMetaTextActive: {
    color: theme.colors.primary,
  },
  serviceCardLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  serviceCardLocationText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  serviceCardLocationTextActive: {
    color: theme.colors.primary,
  },
});

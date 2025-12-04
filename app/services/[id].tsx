import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Building2, MapPin, Phone, Star } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Mock data - in real app, fetch by ID
const clinics = [
  {
    id: "1",
    name: "VetCare Clinic",
    rating: 4.8,
    distance: "2.5 km",
    address: "123 Main St, City",
    phone: "+1 234-567-8900",
    email: "info@vetcareclinic.com",
    hours: {
      monday: "9:00 AM - 6:00 PM",
      tuesday: "9:00 AM - 6:00 PM",
      wednesday: "9:00 AM - 6:00 PM",
      thursday: "9:00 AM - 6:00 PM",
      friday: "9:00 AM - 6:00 PM",
      saturday: "10:00 AM - 4:00 PM",
      sunday: "Closed",
    },
    services: [
      {
        id: "1",
        name: "General Consultation",
        description: "Regular health check-up and consultation",
        price: "$50 - $80",
        duration: "30-45 min",
      },
      {
        id: "2",
        name: "Vaccination",
        description: "All types of vaccinations",
        price: "$30 - $60",
        duration: "15-30 min",
      },
      {
        id: "3",
        name: "Surgery",
        description: "Various surgical procedures",
        price: "$200 - $500",
        duration: "1-3 hours",
      },
      {
        id: "4",
        name: "Dental Cleaning",
        description: "Professional dental cleaning",
        price: "$100 - $200",
        duration: "45-60 min",
      },
    ],
    veterinarians: [
      { name: "Dr. Sarah Johnson", specialization: "General Practice" },
      { name: "Dr. Michael Chen", specialization: "Surgery" },
    ],
    description:
      "VetCare Clinic is a full-service veterinary clinic providing comprehensive care for pets. We offer a wide range of services including general consultations, vaccinations, surgeries, and emergency care.",
  },
];

export default function ClinicDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const clinic = clinics.find((c) => c.id === id);

  if (!clinic) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Clinic Details</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Clinic not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{clinic.name}</Text>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Clinic Header */}
        <Card style={styles.headerCard}>
          <View style={styles.clinicHeader}>
            <View style={styles.clinicIcon}>
              <Building2 size={32} color={theme.colors.primary} />
            </View>
            <View style={styles.clinicInfo}>
              <Text style={styles.clinicName}>{clinic.name}</Text>
              <View style={styles.ratingContainer}>
                <Star size={16} color={theme.colors.warning} fill={theme.colors.warning} />
                <Text style={styles.rating}>{clinic.rating}</Text>
                <Text style={styles.distance}>• {clinic.distance}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Contact Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.contactItem}>
            <MapPin size={18} color={theme.colors.textSecondary} />
            <Text style={styles.contactText}>{clinic.address}</Text>
          </View>
          <View style={styles.contactItem}>
            <Phone size={18} color={theme.colors.textSecondary} />
            <TouchableOpacity>
              <Text style={styles.contactLink}>{clinic.phone}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactItem}>
            <Ionicons
              name="mail-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.contactText}>{clinic.email}</Text>
          </View>
        </Card>

        {/* Hours */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <View style={styles.hoursList}>
            {Object.entries(clinic.hours).map(([day, hours]) => (
              <View key={day} style={styles.hoursRow}>
                <Text style={styles.hoursDay}>
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </Text>
                <Text style={styles.hoursTime}>{hours}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Services */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Services Offered</Text>
          {clinic.services.map((service) => (
            <View key={service.id} style={styles.serviceItem}>
              <View style={styles.serviceHeader}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.servicePrice}>{service.price}</Text>
              </View>
              <Text style={styles.serviceDescription}>
                {service.description}
              </Text>
              <View style={styles.serviceMeta}>
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.serviceDuration}>{service.duration}</Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Veterinarians */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Our Veterinarians</Text>
          {clinic.veterinarians.map((vet, index) => (
            <View key={index} style={styles.vetItem}>
              <View style={styles.vetAvatar}>
                <Ionicons
                  name="person"
                  size={20}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.vetInfo}>
                <Text style={styles.vetName}>{vet.name}</Text>
                <Text style={styles.vetSpecialization}>
                  {vet.specialization}
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Description */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.descriptionText}>{clinic.description}</Text>
        </Card>

        {/* Book Appointment Button */}
        <Button
          title="Book Appointment"
          onPress={() =>
            router.push({
              pathname: "/appointments/book",
              params: { clinicId: clinic.id },
            } as any)
          }
          size="large"
          style={styles.bookButton}
        />
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
    flex: 1,
    textAlign: "center",
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
  headerCard: {
    marginBottom: theme.spacing.md,
  },
  clinicHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  clinicIcon: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  clinicInfo: {
    flex: 1,
  },
  clinicName: {
    ...theme.typography.h2,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  rating: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
  },
  distance: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  contactText: {
    ...theme.typography.body,
    color: theme.colors.text,
    flex: 1,
  },
  contactLink: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  hoursList: {
    gap: theme.spacing.sm,
  },
  hoursRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.xs,
  },
  hoursDay: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "500",
  },
  hoursTime: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  serviceItem: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  serviceName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
    flex: 1,
  },
  servicePrice: {
    ...theme.typography.body,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  serviceDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  serviceMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  serviceDuration: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  vetItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  vetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  vetInfo: {
    flex: 1,
  },
  vetName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: "600",
    marginBottom: theme.spacing.xs,
  },
  vetSpecialization: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  descriptionText: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  bookButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
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
  },
  backButton: {
    minWidth: 200,
  },
});



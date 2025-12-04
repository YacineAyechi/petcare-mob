import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Building2 } from "lucide-react-native";
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
import { serviceService, Service } from "@/services/serviceService";

const serviceTypes = [
  { id: "all", name: "All", icon: "grid" },
  { id: "Consultation", name: "Consultation", icon: "medical" },
  { id: "Vaccination", name: "Vaccination", icon: "shield-checkmark" },
  { id: "Grooming", name: "Grooming", icon: "cut" },
  { id: "Emergency", name: "Emergency", icon: "alert-circle" },
];

export default function ServicesScreen() {
  const [selectedType, setSelectedType] = useState("all");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadServices();
    }, [loadServices])
  );

  const filteredServices = services.filter((service) => {
    if (selectedType === "all") return true;
    return service.category === selectedType;
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Veterinary Services</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      {/* Service Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {serviceTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterChip,
              selectedType === type.id && styles.filterChipActive,
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Ionicons
              name={type.icon as any}
              size={18}
              color={
                selectedType === type.id
                  ? theme.colors.white
                  : theme.colors.textSecondary
              }
            />
            <Text
              style={[
                styles.filterChipText,
                selectedType === type.id && styles.filterChipTextActive,
              ]}
            >
              {type.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
          {filteredServices.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No services found</Text>
            </View>
          ) : (
            filteredServices.map((service) => {
              return (
                <Card key={service._id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <View style={styles.serviceImage}>
                      <Building2 size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <View style={styles.serviceTitleRow}>
                        <Text style={styles.serviceName}>{service.name}</Text>
                      </View>
                      <View style={styles.serviceMeta}>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="time-outline"
                            size={14}
                            color={theme.colors.textSecondary}
                          />
                          <Text style={styles.metaText}>
                            {service.duration} min
                          </Text>
                        </View>
                        <View style={styles.metaItem}>
                          <Ionicons
                            name="cash-outline"
                            size={14}
                            color={theme.colors.textSecondary}
                          />
                          <Text style={styles.metaText}>${service.price}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  <View style={styles.serviceDetails}>
                    <Text style={styles.descriptionText}>
                      {service.description}
                    </Text>
                  </View>

                  <View style={styles.servicesList}>
                    <View style={styles.serviceTag}>
                      <Text style={styles.serviceTagText}>
                        {service.category}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceActions}>
                    <Button
                      title="Book Appointment"
                      onPress={() =>
                        router.push({
                          pathname: "/appointments/book",
                          params: { serviceId: service._id },
                        } as any)
                      }
                      size="small"
                      style={styles.actionButton}
                    />
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
  },
  title: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  filterScroll: {
    maxHeight: 60,
  },
  filterContent: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    gap: theme.spacing.xs,
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary,
  },
  filterChipText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: theme.colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  serviceCard: {
    marginBottom: theme.spacing.md,
  },
  serviceHeader: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  serviceImage: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  serviceName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  rating: {
    ...theme.typography.bodySmall,
    color: theme.colors.text,
    fontWeight: "600",
  },
  serviceMeta: {
    flexDirection: "row",
    gap: theme.spacing.md,
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
  serviceDetails: {
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  detailText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  servicesList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  serviceTag: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.primary + "20",
  },
  serviceTagText: {
    ...theme.typography.caption,
    color: theme.colors.primary,
    fontWeight: "500",
  },
  serviceActions: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flex: 1,
  },
  callButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: "center",
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  descriptionText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
});

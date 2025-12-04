import Card from "@/components/ui/Card";
import { theme } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { Cat, Dog } from "lucide-react-native";
import React, { useState, useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { petService, Pet } from "@/services/petService";
import { vaccinationService, Vaccination } from "@/services/vaccinationService";

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

export default function PetsScreen() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [vaccinations, setVaccinations] = useState<
    Record<string, Vaccination[]>
  >({});
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const petsData = await petService.getAllPets();
      setPets(petsData);

      // Load vaccinations for each pet
      const vaccData: Record<string, Vaccination[]> = {};
      for (const pet of petsData) {
        try {
          const petVaccinations = await vaccinationService.getPetVaccinations(
            pet._id
          );
          vaccData[pet._id] = petVaccinations;
        } catch (error) {
          console.error(
            `Error loading vaccinations for pet ${pet._id}:`,
            error
          );
          vaccData[pet._id] = [];
        }
      }
      setVaccinations(vaccData);
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getLastVaccination = (petId: string) => {
    const petVaccinations = vaccinations[petId] || [];
    const completed = petVaccinations
      .filter((v) => v.date)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return completed.length > 0 ? formatDate(completed[0].date) : "None";
  };

  const getNextVaccination = (petId: string) => {
    const petVaccinations = vaccinations[petId] || [];
    const upcoming = petVaccinations
      .filter((v) => v.nextDueDate)
      .sort(
        (a, b) =>
          new Date(a.nextDueDate!).getTime() -
          new Date(b.nextDueDate!).getTime()
      );
    return upcoming.length > 0 ? formatDate(upcoming[0].nextDueDate!) : "None";
  };
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Pets</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/pets/add" as any)}
        >
          <Ionicons name="add-circle" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>

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
          {pets.map((pet) => {
            const PetIcon = getPetIcon(pet.species);
            return (
              <TouchableOpacity
                key={pet._id}
                onPress={() => router.push(`/pets/${pet._id}` as any)}
              >
                <Card style={styles.petCard}>
                  <View style={styles.petHeader}>
                    <View style={styles.petPhoto}>
                      {pet.photo ? (
                        <Image
                          source={{ uri: pet.photo }}
                          style={styles.petPhotoImage}
                        />
                      ) : (
                        <PetIcon size={32} color={theme.colors.primary} />
                      )}
                    </View>
                    <View style={styles.petInfo}>
                      <Text style={styles.petName}>{pet.name}</Text>
                      <Text style={styles.petBreed}>{pet.breed}</Text>
                      <View style={styles.petDetails}>
                        <Text style={styles.petDetail}>
                          {pet.age} {pet.age === 1 ? "year" : "years"} old •{" "}
                          {pet.gender}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.colors.textLight}
                    />
                  </View>

                  <View style={styles.petStats}>
                    <View style={styles.stat}>
                      <Ionicons
                        name="shield-checkmark"
                        size={16}
                        color={theme.colors.secondary}
                      />
                      <Text style={styles.statText}>
                        Last: {getLastVaccination(pet._id)}
                      </Text>
                    </View>
                    <View style={styles.stat}>
                      <Ionicons
                        name="calendar"
                        size={16}
                        color={theme.colors.warning}
                      />
                      <Text style={styles.statText}>
                        Next: {getNextVaccination(pet._id)}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={styles.addPetCard}
            onPress={() => router.push("/pets/add" as any)}
          >
            <View style={styles.addPetContent}>
              <Ionicons
                name="add-circle-outline"
                size={48}
                color={theme.colors.primary}
              />
              <Text style={styles.addPetText}>Add New Pet</Text>
            </View>
          </TouchableOpacity>
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
  addButton: {
    padding: theme.spacing.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  petCard: {
    marginBottom: theme.spacing.md,
  },
  petHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  petPhoto: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.md,
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  petBreed: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  petDetails: {
    flexDirection: "row",
  },
  petDetail: {
    ...theme.typography.bodySmall,
    color: theme.colors.textLight,
  },
  petStats: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  statText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
  },
  addPetCard: {
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
  },
  addPetContent: {
    alignItems: "center",
  },
  addPetText: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  petPhotoImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

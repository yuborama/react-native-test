import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { extractIngredients, getMealById } from "@/features/meals/api";
import type { Meal } from "@/features/meals/types";

export default function MealDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    const loadDetail = async () => {
      if (!id) {
        setLoading(false);
        setError("Invalid meal id");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await getMealById(id);
        if (!cancelled) {
          setMeal(result);
        }
      } catch (detailError) {
        if (!cancelled) {
          const message =
            detailError instanceof Error
              ? detailError.message
              : "Unexpected detail error";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDetail();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const ingredients = useMemo(
    () => (meal ? extractIngredients(meal) : []),
    [meal],
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.pageContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  if (!meal) {
    return (
      <SafeAreaView style={styles.pageContainer}>
        <Text style={styles.notFoundText}>Meal not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: meal.strMeal }} />
      <SafeAreaView style={styles.pageContainer}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.heroImageWrapper}>
            <Image
              source={{ uri: meal.strMealThumb }}
              style={styles.heroImage}
            />
          </View>

          <Animated.Text
            entering={FadeIn.delay(120).duration(500)}
            style={styles.title}
          >
            {meal.strMeal}
          </Animated.Text>
          <Animated.Text
            entering={FadeIn.delay(180).duration(500)}
            style={styles.subtitle}
          >
            {meal.strCategory ?? "Unknown"} | {meal.strArea ?? "Unknown"}
          </Animated.Text>

          <Animated.View
            entering={FadeIn.delay(260).duration(500)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {ingredients.map((item, index) => (
              <Text
                key={`${item.ingredient}-${index}`}
                style={styles.sectionText}
              >
                - {item.ingredient}
                {item.measure ? ` - ${item.measure}` : ""}
              </Text>
            ))}
          </Animated.View>

          <Animated.View
            entering={FadeIn.delay(340).duration(500)}
            style={styles.section}
          >
            <Text style={styles.sectionTitle}>Instructions</Text>
            <Text style={styles.instructions}>
              {meal.strInstructions ?? "No instructions available."}
            </Text>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#F4F5F8",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F5F8",
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 28,
  },
  heroImage: {
    width: "100%",
    height: 240,
  },
  heroImageWrapper: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
  },
  subtitle: {
    fontSize: 14,
    color: "#5E6674",
  },
  section: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E8EAF0",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
  },
  sectionText: {
    fontSize: 14,
    color: "#2D3443",
    marginBottom: 4,
  },
  instructions: {
    fontSize: 14,
    lineHeight: 21,
    color: "#2D3443",
  },
  errorText: {
    color: "#B31E1E",
    fontSize: 16,
    padding: 16,
  },
  notFoundText: {
    color: "#2D3443",
    fontSize: 16,
    padding: 16,
  },
});

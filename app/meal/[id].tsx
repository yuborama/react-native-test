import { extractIngredients, getMealById } from "@/features/meals/api";
import type { Meal } from "@/features/meals/types";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MealDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id?: string | string[];
    name?: string | string[];
    thumb?: string | string[];
    category?: string | string[];
    area?: string | string[];
  }>();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const initialName = Array.isArray(params.name) ? params.name[0] : params.name;
  const initialThumb = Array.isArray(params.thumb)
    ? params.thumb[0]
    : params.thumb;
  const initialCategory = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const initialArea = Array.isArray(params.area) ? params.area[0] : params.area;

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

  const displayName = meal?.strMeal ?? initialName ?? "Meal detail";
  const displayThumb = meal?.strMealThumb ?? initialThumb;
  const displayCategory = meal?.strCategory ?? initialCategory ?? "Unknown";
  const displayArea = meal?.strArea ?? initialArea ?? "Unknown";
  const imageTag = `meal-image-${id ?? "unknown"}`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false, title: displayName }} />
      <View style={styles.pageContainer}>
        <View style={styles.topBar}>
          <SafeAreaView edges={["top"]} style={styles.topControls}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              {/* icon back for expo*/}
              <Ionicons name="arrow-back" size={16} color="#FFFFFF" />
              <Text style={styles.backButtonText}>{"Back"}</Text>
            </Pressable>
          </SafeAreaView>
        </View>

        {displayThumb ? (
          <Animated.Image
            source={{ uri: displayThumb }}
            style={styles.heroImage}
            sharedTransitionTag={imageTag}
          />
        ) : (
          <View style={styles.heroPlaceholder} />
        )}

        <SafeAreaView
          edges={["left", "right", "bottom"]}
          style={styles.safeArea}
        >
          <ScrollView contentContainerStyle={styles.content}>
            <Animated.Text
              entering={FadeIn.delay(120).duration(500)}
              style={styles.title}
            >
              {displayName}
            </Animated.Text>
            <Animated.Text
              entering={FadeIn.delay(180).duration(500)}
              style={styles.subtitle}
            >
              {displayCategory} | {displayArea}
            </Animated.Text>

            {loading ? <ActivityIndicator style={styles.inlineLoader} /> : null}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {!loading && !meal ? (
              <Text style={styles.notFoundText}>Meal not found</Text>
            ) : null}

            {!loading && meal ? (
              <>
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
              </>
            ) : null}
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    backgroundColor: "#F4F5F8",
  },
  topBar: {
    backgroundColor: "#111827",
  },
  topControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(17, 24, 39, 0.72)",
    borderRadius: 999,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
  topTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  heroImage: {
    width: "100%",
    height: 260,
  },
  heroPlaceholder: {
    width: "100%",
    height: 260,
    backgroundColor: "#DDE2EA",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
    gap: 12,
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
  inlineLoader: {
    marginTop: 8,
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
    fontSize: 15,
    marginTop: 10,
  },
  notFoundText: {
    color: "#2D3443",
    fontSize: 15,
    marginTop: 10,
  },
});

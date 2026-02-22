import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchMealsByName } from "@/features/meals/api";
import type { Meal } from "@/features/meals/types";

function useDebouncedValue<T>(value: T, delayMs = 350) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debounced;
}

export default function ExploreScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 350);

  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      const normalizedQuery = debouncedQuery.trim();

      if (!normalizedQuery) {
        setMeals([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await searchMealsByName(normalizedQuery);
        if (!cancelled) {
          setMeals(results);
        }
      } catch (searchError) {
        if (!cancelled) {
          const message =
            searchError instanceof Error
              ? searchError.message
              : "Unexpected search error";
          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Explore Meals</Text>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search meals (e.g. chicken, pasta)"
        autoCapitalize="none"
        style={styles.input}
      />

      {loading ? <ActivityIndicator style={styles.loader} /> : null}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {!loading && !error && debouncedQuery.trim() && meals.length === 0 ? (
        <Text style={styles.emptyText}>No results</Text>
      ) : null}

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/meal/[id]",
                params: { id: item.idMeal },
              })
            }
          >
            <View style={styles.thumbnailWrapper}>
              <Image
                source={{ uri: item.strMealThumb }}
                style={styles.thumbnail}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.mealName}>{item.strMeal}</Text>
              <Text style={styles.mealHint}>Tap to view details</Text>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: "#F3F4F7",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: "#D8DAE0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  loader: {
    marginVertical: 8,
  },
  errorText: {
    color: "#B31E1E",
    marginBottom: 8,
  },
  emptyText: {
    color: "#4E5562",
    marginBottom: 8,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderColor: "#E7E9EF",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
  },
  thumbnail: {
    width: "100%",
    height: 180,
  },
  thumbnailWrapper: {
    width: "100%",
    height: 180,
    overflow: "hidden",
  },
  cardBody: {
    padding: 12,
  },
  mealName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#131722",
  },
  mealHint: {
    marginTop: 4,
    fontSize: 14,
    color: "#667085",
  },
});

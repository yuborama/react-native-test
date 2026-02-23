import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { searchMealsByName } from "@/features/meals/api";
import type { Meal } from "@/features/meals/types";

type MealCardProps = {
  item: Meal;
  onOpenMeal: (item: Meal) => void;
};

function MealCard({ item, onOpenMeal }: MealCardProps) {
  return (
    <Pressable style={styles.card} onPress={() => onOpenMeal(item)}>
      <View style={styles.thumbnailWrapper}>
        <Animated.Image
          source={{ uri: item.strMealThumb }}
          style={styles.thumbnail}
          sharedTransitionTag={`meal-image-${item.idMeal}`}
        />
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.mealName}>{item.strMeal}</Text>
        <Text style={styles.mealHint}>Tap to view details</Text>
      </View>
    </Pressable>
  );
}

const EMPTY_LOTTIES = [
  require("../../assets/lotties/fries-chips.json"),
  require("../../assets/lotties/pinch.json"),
  require("../../assets/lotties/pizza.json"),
  require("../../assets/lotties/sausage.json"),
];

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
  const [emptyAnimationIndex, setEmptyAnimationIndex] = useState(() =>
    Math.floor(Math.random() * EMPTY_LOTTIES.length),
  );

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

  useEffect(() => {
    if (!loading && !error && meals.length === 0) {
      setEmptyAnimationIndex(Math.floor(Math.random() * EMPTY_LOTTIES.length));
    }
  }, [loading, error, meals]);

  const openMealDetail = (item: Meal) => {
    router.push({
      pathname: "/meal/[id]",
      params: {
        id: item.idMeal,
        name: item.strMeal,
        thumb: item.strMealThumb,
        category: item.strCategory ?? "",
        area: item.strArea ?? "",
      },
    });
  };

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

      <FlatList
        data={meals}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={[
          styles.listContent,
          !loading &&
            !error &&
            meals.length === 0 &&
            styles.listContentWhenEmpty,
        ]}
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <LottieView
                source={EMPTY_LOTTIES[emptyAnimationIndex]}
                autoPlay
                loop
                style={styles.emptyAnimation}
              />
              <Text style={styles.emptyText}>
                {debouncedQuery.trim()
                  ? "No results for your search"
                  : "Start typing to search meals"}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <MealCard item={item} onOpenMeal={openMealDetail} />
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
    alignItems: "center",
    justifyContent: "center",
  },
  loaderAnimation: {
    width: 140,
    height: 140,
  },
  errorText: {
    color: "#B31E1E",
    marginBottom: 8,
  },
  emptyText: {
    color: "#4E5562",
    marginTop: 6,
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 24,
    paddingBottom: 12,
  },
  emptyAnimation: {
    width: 220,
    height: 220,
  },
  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  listContentWhenEmpty: {
    flexGrow: 1,
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

import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/features/restaurant/components/Header";
import Listing from "@/features/restaurant/components/Listing";
import { styles } from "@/features/restaurant/styles";
import type {
  Restaurant,
  RestaurantsResponse,
} from "@/features/restaurant/types";

const buildUrl = (nextPage: number) => {
  const params = new URLSearchParams();
  params.set("page", String(nextPage));

  return `https://jsonmock.hackerrank.com/api/food_outlets?${params.toString()}`;
};

export default function HomeScreen() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRestaurants = useCallback(
    async ({ nextPage, append }: { nextPage: number; append: boolean }) => {
      const response = await fetch(buildUrl(nextPage));
      const result: RestaurantsResponse = await response.json();

      setTotalPages(result.total_pages);
      setPage(result.page);
      setRestaurants((prev) =>
        append ? [...prev, ...result.data] : result.data,
      );
    },
    [],
  );

  useEffect(() => {
    const initialLoad = async () => {
      try {
        await fetchRestaurants({
          nextPage: 1,
          append: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialLoad();
  }, [fetchRestaurants]);

  const loadMore = async () => {
    if (isLoading || isLoadingMore || page >= totalPages) {
      return;
    }

    setIsLoadingMore(true);
    try {
      await fetchRestaurants({
        nextPage: page + 1,
        append: true,
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator testID="progress" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header count={restaurants.length} />
      <Listing
        restaurants={restaurants}
        onEndReached={loadMore}
        isLoadingMore={isLoadingMore}
      />
    </SafeAreaView>
  );
}

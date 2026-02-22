import { ActivityIndicator, FlatList, View } from 'react-native';

import type { Restaurant } from '../types';
import { styles } from '../styles';
import ListingItem from './ListingItem';

type ListingProps = {
  restaurants: Restaurant[];
  onEndReached: () => void;
  isLoadingMore: boolean;
};

export default function Listing({ restaurants, onEndReached, isLoadingMore }: ListingProps) {
  return (
    <FlatList
      data={restaurants}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => <ListingItem restaurant={item} />}
      contentContainerStyle={styles.listContent}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.25}
      ListFooterComponent={
        isLoadingMore ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator />
          </View>
        ) : null
      }
    />
  );
}

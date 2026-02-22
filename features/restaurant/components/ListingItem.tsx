import { Text, View } from 'react-native';

import { styles } from '../styles';
import type { Restaurant } from '../types';

type ListingItemProps = {
  restaurant: Restaurant;
};

export default function ListingItem({ restaurant }: ListingItemProps) {
  return (
    <View testID="restaurant-item" style={styles.item}>
      <View style={styles.itemLeft}>
        <Text testID="name" style={styles.name}>
          {restaurant.name}
        </Text>
        <Text testID="city" style={styles.city}>
          {restaurant.city}
        </Text>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.ratingRow}>
          ★{' '}
          <Text testID="average-rating" style={styles.ratingValue}>
            {restaurant.user_rating.average_rating}
          </Text>
        </Text>
        <Text testID="votes-count" style={styles.votes}>
          {restaurant.user_rating.votes} votes
        </Text>
      </View>
    </View>
  );
}

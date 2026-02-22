import { Text } from 'react-native';

import { styles } from '../styles';

type HeaderProps = {
  count: number;
};

export default function Header({ count }: HeaderProps) {
  return <Text style={styles.headerText}>{count} Restaurants Near You</Text>;
}

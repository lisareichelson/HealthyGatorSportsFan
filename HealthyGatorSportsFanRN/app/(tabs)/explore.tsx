import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View, Text, Image, Platform } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function BasicInformationCollection() {
  return (
      <View style={styles1.container}>
        <Text>Testing. Is Screen Reached?</Text>
      </View>
  );
}
const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomObject: {
    position: 'absolute',
    bottom: 10,
    left: 320,
    right: 0,
  },
});

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

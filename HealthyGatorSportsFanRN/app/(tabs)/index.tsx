import { Image, StyleSheet, Text, View, Platform } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
      <View style={styles1.container} >
          <Image source={require('./../../assets/images/coolgator.png')} />
          <Text style={{fontSize:40, fontFamily:'System'}}>Hey there, Gator!</Text>
          <Text style={{fontSize:40, fontFamily:'System', alignItems: 'center' }}>Get started on your health journey today.</Text>
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
});

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});

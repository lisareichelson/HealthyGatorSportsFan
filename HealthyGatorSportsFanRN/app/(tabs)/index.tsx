import { Image, StyleSheet, Text, View, Platform, TouchableOpacity} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import BasicInformationCollection from "@/app/(tabs)/basicinfo";

export default function HomeScreen() {
    const navigation = useNavigation();
  return (
      <View style={styles1.container}>
          <Image source={require('./../../assets/images/coolgator.png')}/>
          <Text style={{fontSize: 40, fontFamily: 'System'}}>Hey there, Gator!</Text>
          <Text style={{fontSize: 40, fontFamily: 'System', alignItems: 'center'}}>Get started on your health journey
              today.</Text>
          <View style={styles1.bottomObject}>
          <TouchableOpacity activeOpacity={0.5}
                            onPress={() => navigation.navigate('BasicInfo' as never) }>
              <Image
                  source={require('./../../assets/images/forwardarrow.png')}
                  style={{width:50, height:50}}
              />
          </TouchableOpacity>
      </View>
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

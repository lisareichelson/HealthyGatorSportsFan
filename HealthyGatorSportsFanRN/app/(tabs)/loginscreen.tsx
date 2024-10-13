import {StyleSheet, View, Text, Image, useWindowDimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
export default function LogInScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 100}}>Login screen placeholder.</Text>
        </View>
    );
}
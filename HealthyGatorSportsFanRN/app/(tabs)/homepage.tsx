import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
export default function HomePage() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 15, fontFamily: 'System'}}>
                Welcome to the placeholder home screen!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
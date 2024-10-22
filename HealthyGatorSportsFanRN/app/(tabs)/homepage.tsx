import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
export default function HomePage() {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.topMenu}>
                <Image
                    source={require('./../../assets/images/clipboardgator.jpg')}
                    style={{width:55, height:55}}
                />
                <Text style={{fontSize: 25, fontFamily: 'System'}}>
                    Hey, Albert!
                </Text>
                <TouchableOpacity style = {styles.topIcons} activeOpacity={0.5}
                                  onPress={() => navigation.navigate('NotificationsPage' as never) }>
                    <Image
                        source={require('./../../assets/images/defaultprofile.png')}
                        style={{width:30, height:30, alignSelf: 'center'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topIcons} activeOpacity={0.5}
                                  onPress={() => navigation.navigate('NotificationsPage' as never) }>
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{width:30, height:30, alignSelf: 'center'}}
                    />
                </TouchableOpacity>
            </View>
            <Text style={{fontSize: 15, fontFamily: 'System', marginTop: 50, alignSelf:'center'}}>
                Welcome to the placeholder home screen!
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topMenu:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        marginTop: '15%',
    },
    topIcons:{
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor:'#fae7d7',
        borderRadius: 40,
        height: 40,
        width: 40,
    }
});
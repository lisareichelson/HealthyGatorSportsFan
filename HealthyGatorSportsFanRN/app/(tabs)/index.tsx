/*This is the login or create account screen that will launch at the application's start*/

import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";

export default function CreateOrSignIn() {
    const navigation = useNavigation();
    return(
        <View style={styles.container}>
            <Image source={require('./../../assets/images/coolgator.png')}/>
            <TouchableOpacity style = {[styles.buttons, {marginTop: 100} ]} activeOpacity={0.5}
                              onPress={() => navigation.navigate('WelcomeScreen' as never) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {[styles.buttons, {marginTop: 20} ]} activeOpacity={0.5}
                              onPress={() => navigation.navigate('LogInScreen' as never) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Login</Text>
            </TouchableOpacity>
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
    bottomObject: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'flex-end',
        padding: 20
    },
    buttons:{
        borderWidth:1,
        borderColor:'black',
        width:200,
        height:50,
        backgroundColor:'#fff',
        borderRadius:50,
        justifyContent: "center",
        alignItems: "center",
    }
});
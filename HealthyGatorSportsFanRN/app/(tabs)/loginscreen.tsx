import {StyleSheet, View, Text, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
export default function LogInScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    return (
            <View style={styles.container}>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Please enter your username and password.
                </Text>
                <TextInput
                    style = {[styles.input, {marginTop: 100} ]}
                    placeholder="Username"
                    value={username}
                    onChangeText={user => setUsername(user)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={pass => setPassword(pass)}
                    secureTextEntry={true}
                />
                <TouchableOpacity style = {[styles.buttons, {marginTop: 20} ]} activeOpacity={0.5}
                                  onPress={() => ConfirmData(username, password, navigation) }>
                    <Text style={{fontSize: 15, fontFamily: 'System'}}>
                        Login
                    </Text>
                </TouchableOpacity>
        </View>
    );
}

//TODO
function ConfirmData(username: any, password: any, navigation: any){
    //Connect to DB and ensure that the provided username and password are correct and exist
    console.log(username);
    console.log(password);
    //Eventually design a backup email verification system for forgotten passwords.

    //Navigate to the user's home page.

    //TODO: REMOVE ME AFTER TESTING
    if ((username == "debug" || username == "Debug") && (password == "debug" || password == "Debug")){
        //Navigate to the home screen
        navigation.navigate('HomePage' as never);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttons:{
        borderWidth:1,
        borderColor:'orange',
        width:200,
        height:50,
        backgroundColor:'#ADD8E6',
        borderRadius:50,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        width: '90%',
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
});
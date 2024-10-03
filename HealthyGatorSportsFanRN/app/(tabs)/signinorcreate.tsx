import {StyleSheet, View, Text, Image, useWindowDimensions, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';

//PLACEHOLDER CODE: Insert this between the welcome screen and the next screens once the google sign in is working.
export default function CreateOrSignIn() {

    return(
        <View>
            <Text style={{fontSize: 15, fontFamily: 'System', alignContent: "center", paddingTop: 100}}>
                Hello, you have reached the placeholder account screen.</Text>
            <TouchableOpacity activeOpacity={0.5}
                                onPress={() => CreateAccount() }>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.5}
                              onPress={() => SignInWithGoogle() }>
            </TouchableOpacity>
        </View>
    );
}

function CreateAccount(){
    //Navigate to account creation screen
}

function SignInWithGoogle(){
    //Use the google API to fetch account details.
}
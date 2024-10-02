import {StyleSheet, View, Text, Image, useWindowDimensions, Platform, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
//import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';

//PLACEHOLDER CODE: Insert this between the welcome screen and the next screens once the google sign in is working.
export default function CreateOrSignIn() {

    return(
        <View>
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
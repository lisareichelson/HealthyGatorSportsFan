import {StyleSheet, View, Text, Alert, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import User from "@/components/user";

//PLACEHOLDER CODE: Insert this between the welcome screen and the next screens once the google sign in is working.
export default function CreateCredentials() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmed, setPasswordConfirmed] = useState('');

    return(
        <View style={styles.container}>
            <Text style={{fontSize: 15, fontFamily: 'System'}}>
                Please provide an email and password.
            </Text>
            <TextInput
                style = {[styles.input, {marginTop: 15} ]}
                placeholder="Email"
                value={email}
                onChangeText={email => setEmail(email)}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={pass => setPassword(pass)}
                secureTextEntry={true}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={passwordConfirmed}
                onChangeText={pass => setPasswordConfirmed(pass)}
                secureTextEntry={true}
            />
            <Text style={{fontSize: 15, fontFamily: 'System', textAlign: 'center', margin : 20, color: "grey"}}>
                Passwords must contain at least 1 letter and character, and must be at least 8 characters long.
            </Text>
                <TouchableOpacity style = {[styles.buttons, {marginTop: 20} ]} activeOpacity={0.5}
                                  onPress={() => ConfirmData(email, password, passwordConfirmed, navigation) }>
                    <Text style={{fontSize: 15, fontFamily: 'System'}}>
                        Create Account
                    </Text>
                </TouchableOpacity>
        </View>
    );
}


function ConfirmData(email: any, password: any, passwordConfirmed: any, navigation : any){
    //Check that the inputted username does not yet exist through connection with database
    //TODO

    //Confirm that the email format is valid //todo; add more checks here
    if(!(email.includes("@") && email.includes("."))){
        Alert.alert("Invalid email address!");
        return;
    }

    //Confirm that the password and the confirmedpassword match
    if (password != passwordConfirmed){
        Alert.alert("Passwords do not match!");
        return;
    }
    if (password.length < 8){
        Alert.alert("Passwords must be at least 8 characters long!");
        return;
    }
    //Use regex to check if the password string contains a digit
    var hasNumber = /\d/;
    if (!hasNumber.test(password)){
        Alert.alert("Passwords must include a numeric character!");
        return;
    }
    //Use regex to check if the password string contains a letter
    var hasLetter = /.*[a-zA-Z].*/;
    if (!hasLetter.test(password)){
        Alert.alert("Passwords must include a character!");
        return;
    }

    //Save the email and password, if valid, to the database //TODO
    console.log(email);
    console.log(password);

    
     // API call to send the data to the backend to api/users
     const url = 'https://normal-elegant-corgi.ngrok-free.app/api/users/'; // Adjust the endpoint to your computer IP address
     fetch(url, {
         // send the user credentials to the backend
         method: 'POST',
         // this is a header to tell the server to parse the request body as JSON
         headers: {
             'Content-Type': 'application/json',
         },
         // convert the data into JSON format
         body: JSON.stringify({ email, password })
     })
     // check to see what status the server sends back
     .then(response => { // this is an arrow function that takes 'response' as an argument, like function(response)
         if (!response.ok) {
             throw new Error('Failed to save user data');
         }
         // convert the JSON back into a JavaScript object so it can be passed to the next '.then' to log the data that was saved
         return response.json();
     })
     .then(data => { // 'data' is the JavaScript object that was created after parsing the JSON from the server response
         console.log('Data successfully saved:', data);
        
         //Save everything but the password to ID user in next screen
        const currentUser = new User(data.user_id,'','','','','','',0,0,0,false,true,0);
        currentUser.email = email;

        // move to the next screen.
        navigation.navigate('BasicInfo', {currentUser} as never);

     })
     .catch(error => {
         console.error('Error saving data:', error);
         Alert.alert("Failed to create account, please try again!");
     });

     // moved Lisa's code to 'then(data =>)' above, so that we can have access to user_id
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
    }
});
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useState} from "react";
import Checkbox from 'expo-checkbox';
import User from "@/components/user";

const GoalCollection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const currentUser = route.params as any;

    const [feelBetter, setFeelBetter] = useState(false);
    const [loseWeight, setLoseWeight] = useState(false);

    // startWeight will automatically get initialized to the currentWeight (which is fetched from weight_value).
    const [startWeight, setStartWeight] = useState(currentUser.currentWeight || '');

    const [goalWeight, setGoalWeight] = useState('');

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontFamily: 'System'}}>
                What are your goals?
            </Text>
            <View style = {[styles.row, {marginTop: 25}]}>
                <Checkbox style={styles.checkbox} value={feelBetter} onValueChange={setFeelBetter} />
                <Text style={{fontSize: 15, fontFamily: 'System', color: '#C76E00'}}>
                Feel Better
                </Text>
                <Image
                    source={require('./../../assets/images/smiley.jpg')}
                    style={{width:25, height:25}}
                />
            </View>
            <View style = {[styles.row, {marginTop: 10}]}>
                <Checkbox style={styles.checkbox} value={loseWeight} onValueChange={setLoseWeight} />
                <Text style={{fontSize: 15, fontFamily: 'System', color: '#C76E00'}}>
                    Lose Weight
                </Text>
                <Image
                    source={require('./../../assets/images/lose.png')}
                    style={{width:25, height:25}}
                />
            </View>
            {loseWeight && <View>
                <View style={{flexDirection:"row", justifyContent:"flex-start", paddingTop: 10}}>
                    <Text style={{fontSize: 15, fontFamily: 'System'}}>Goal Weight:        </Text>
                    <TextInput
                        style={styles.weightBox}
                        placeholder="enter a weight..."
                        keyboardType={"numeric"}
                        editable={true}
                        value={goalWeight}
                        defaultValue={goalWeight}
                        onChangeText={newWeight => setGoalWeight(newWeight)}
                        returnKeyType="done"/>
                </View>
            </View>
            }

            <TouchableOpacity style = {[styles.bottomObject, {marginTop: 150} ]} activeOpacity={0.5}
                              onPress={() => confirmGoals(navigation, feelBetter, loseWeight, startWeight, goalWeight, currentUser)}>
                <Image
                    source={require('./../../assets/images/forwardarrow.png')}
                    style={{width: 50, height: 50}}
                />
            </TouchableOpacity>
        </View>
    );
}

export default GoalCollection

function confirmGoals(navigation: any, feelBetter: any, loseWeight: any, startWeight:any, goalWeight:any, currentUser: any){
    const userData: User = { ...currentUser };
    //This is how to get the data from the currentUser object
   // console.log(JSON.stringify(currentUser) + "/n" + currentUser.currentUser.firstName);

    // Access currentWeight from the nested currentUser structure
    const currentWeight = currentUser.currentUser.currentWeight || startWeight;

    // Determine goal_type based on checkboxes
    let goalType = null;
    if (feelBetter && loseWeight) {
        goalType = 'both';
    } else if (loseWeight) {
        goalType = 'loseWeight';
    } else if (feelBetter) {
        goalType = 'feelBetter';
    }

    // Update goal_to_lose_weight and goal_to_feel_better accordingly
    if (goalType === 'feelBetter') {
        userData.goal_to_feel_better = true;
        userData.goal_to_lose_weight = false;
    } else if (goalType === 'loseWeight') {
        userData.goal_to_lose_weight = true;
        userData.goal_to_feel_better = false;
    } else if (goalType === 'both') {
        userData.goal_to_lose_weight = true;
        userData.goal_to_feel_better = true;
    } else {
        userData.goal_to_lose_weight = false;
        userData.goal_to_feel_better = false;
    }

    if (loseWeight) {
        if (parseFloat(goalWeight) > parseFloat(currentWeight)) {
            Alert.alert("Current Weight cannot be less than goal weight.");
            return;
        }
    }

    // Convert goalWeight to a float
    let goalWeightNum = parseFloat(goalWeight);

    // Define the URL for the POST request
    const url = `https://normal-elegant-corgi.ngrok-free.app/api/users/${currentUser.currentUser.userId}/goals/`;

    // Log payload being sent to backend
    const requestBody = {
        feelBetter,
        loseWeight,
        goal_weight: goalWeightNum,
        goal_type: goalType,
        goal_to_lose_weight: userData.goal_to_lose_weight,
        goal_to_feel_better: userData.goal_to_feel_better,
    };

    // TODO!!!
    /*
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
    })
    .catch(error => {
        console.error('Error saving data:', error);
        Alert.alert("Failed to create account, please try again!");
    });
    */

    // TO-DO, clean this up!
    /*
    // API call to send the basic info data to the backend
    const userId = userData.userId;
    const url = `https://normal-elegant-corgi.ngrok-free.app/api/users/${userId}/basicinfo/`;
    
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            birthdate: birthdate.toISOString().split('T')[0],
            gender: gender,
            height_feet: heightFeet,
            height_inches: heightInches,
            weight_value: weight,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to save user data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Data successfully saved:', data);

            // Explicitly check and set the weight_value to currentWeight
            if (data.weight_value !== undefined) {
                currentUser.currentWeight = data.weight_value;
            } 
        })
        .catch(error => {
            console.error('Error saving data:', error);
            Alert.alert("Failed to save data. Please try again!");
        });
    */

    // Perform the fetch operation
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            feelBetter,
            loseWeight,
            goal_weight: goalWeightNum,
            goal_type: goalType,
            goal_to_lose_weight: userData.goal_to_lose_weight,
            goal_to_feel_better: userData.goal_to_feel_better,
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save your goals.');
        return response.json();
    })
    .then(data => {
        console.log('Goals successfully saved:', data);
        navigation.navigate('HomePage', { user: userData });
    })
    .catch(error => {
        console.error('Error saving goals:', error);
        Alert.alert("Failed to save your goals. Please try again!");
    });
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: "center"
    },
    checkbox: {
        margin: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1.5,
        borderRadius: 10,
    },
    weightBox:{
        borderWidth: 1,
        height: 30,
    },
    bottomObject: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 30,
        alignSelf: 'flex-end',
        padding: 20
    },
});

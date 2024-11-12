import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useState} from "react";
import Checkbox from 'expo-checkbox';
import User from "@/components/user";

const GoalCollection = () => {
    const navigation = useNavigation();
    const route = useRoute();
    //const currentUser = route.params as any;
    const { currentUser } = route.params as { currentUser: any };

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

    // Access currentWeight from the nested currentUser structure
    const currentWeight = currentUser.currentWeight || startWeight;

    // Determine goal_type based on checkboxes (this will be used for UserData table entry)
    // NOTE: 'feelBetter' and 'loseWeight' are frontend 'User' object member variables not used at all in the backend
    let goalType = '';
    if (feelBetter && loseWeight) {
        goalType = 'both';
    } else if (loseWeight) {
        goalType = 'loseWeight';
    } else if (feelBetter) {
        goalType = 'feelBetter';
    }

    // Update goal_to_lose_weight and goal_to_feel_better accordingly (This will be used for User table entry)
    currentUser.goal_to_feel_better = goalType === 'feelBetter' || goalType === 'both';
    currentUser.goal_to_lose_weight = goalType === 'loseWeight' || goalType === 'both';

    if (loseWeight) {
        if (parseFloat(goalWeight) > parseFloat(currentWeight)) {
            Alert.alert("Current Weight cannot be less than goal weight.");
            return;
        }
    }

    // Convert goalWeight to a float
    let goalWeightNum = parseFloat(goalWeight);

    //Save the variables in the user object type
    currentUser.goalWeight = goalWeightNum
    currentUser.goalType = goalType 
    // NOTE: 'goal_type' and 'currentWeight' are frontend 'User' object member variables, but belong to UserData table

    addNewUser(navigation, currentUser);
    
}

function addNewUser(navigation: any, currentUser: any){
    // User POST API call
    // At this point we have everything we need to make the User POST call to create the account
    const createUserUrl = 'https://normal-elegant-corgi.ngrok-free.app/api/users/'; // Adjust the endpoint
    fetch(createUserUrl, {
        // send the user credentials to the backend
        method: 'POST',
        // this is a header to tell the server to parse the request body as JSON
        headers: {
            'Content-Type': 'application/json',
        },
        // convert the data into JSON format
        body: JSON.stringify({
            email: currentUser.email,
            password: currentUser.password,
            first_name: currentUser.firstName,
            last_name: currentUser.lastName,
            birthdate: currentUser.birthDate, // "2000-01-01", 
            gender: currentUser.gender,
            height_feet: currentUser.heightFeet,
            height_inches: currentUser.heightInches,
            goal_weight: currentUser.goalWeight,
            goal_to_lose_weight: currentUser.goal_to_lose_weight,
            goal_to_feel_better: currentUser.goal_to_feel_better,
        }),
    })
    // check to see what status the server sends back
    .then(response => { // this is an arrow function that takes 'response' as an argument, like function(response)
        if (!response.ok) {
            throw new Error('Failed to save user account');
        }
        // convert the JSON back into a JavaScript object so it can be passed to the next '.then' to log the data that was saved
        return response.json();
    })
    .then(data => { // 'data' is the JavaScript object that was created after parsing the JSON from the server response
        console.log('User account saved successfully:', data);
        console.log('data.user_id:', data.user_id); // TO DELETE
        currentUser.userId = data.user_id;
        console.log("UserId before function = ", currentUser.userId) // TO DELETE
        addNewUserInitialProgress(navigation, currentUser);
        navigation.navigate('HomePage', { currentUser }); // TO DELETE! This is here for troubleshooting only. You should only go to the home page upon 2 successful API calls
    })
    .catch(error => {
        console.error('Error saving data:', error);
        Alert.alert("Failed to create account, please try again!");
    });
}

function addNewUserInitialProgress(navigation: any, currentUser: any){
        // UserData POST API call
        console.log("UserID = ", currentUser.userId) // TO DELETE
        const createUserDataUrl = `https://normal-elegant-corgi.ngrok-free.app/api/users/${currentUser.userId}/recordData/`;
        console.log("JSON:") // TO DELETE
        console.log(JSON.stringify({
            goal_type: currentUser.goalType,
            weight_value: currentUser.currentWeight,
            feel_better_value: 3
        })) // TO DELETE
    
        fetch(createUserDataUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                goal_type: currentUser.goalType,
                weight_value: currentUser.currentWeight,
                feel_better_value: 3
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to save your goal progress.');
            return response.json();
        })
        .then(data => {
            console.log('Goal progress successfully saved:', data);
            navigation.navigate('HomePage', { currentUser });
        })
        .catch(error => {
            console.error('Error saving goal progress:', error);
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




    //================================
    // Previous API Call for reference
    //================================

    // Previous URL & POST API call for credentials only; maybe we can use this for reference when updating values in the profile management screen.
    /*
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

    // Previous URL & POST API call for basic info only; maybe we can use this for reference when updating values in the profile management screen.
    /*
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

    // Previous URL & POST API call for goals only; maybe we can use this for reference when updating values in the profile management screen.
    /*
    const url = `https://normal-elegant-corgi.ngrok-free.app/api/users/${currentUser.currentUser.userId}/goals/`;

    // Log payload being sent to backend... (what is the purpose of this?)
    const requestBody = {
        feelBetter,
        loseWeight,
        goal_weight: goalWeightNum,
        goal_type: goalType,
        goal_to_lose_weight: userData.goal_to_lose_weight,
        goal_to_feel_better: userData.goal_to_feel_better,
    };

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
    */
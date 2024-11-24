import {StyleSheet, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useState} from "react";
import StarRating from 'react-native-star-rating-widget';
import User from "@/components/user";
import { AppUrls } from '@/constants/AppUrls';

export default function ProgressLogging() {
    const navigation = useNavigation();
    const route = useRoute();
    const { currentUser } = route.params as { currentUser: any };

    const [newWeight, setNewWeight] = useState(Math.floor(currentUser.currentWeight));
    const [rating, setRating] = useState(0);

    const [isGoalToLoseWeight, setIsGoalToLoseWeight] = useState(currentUser.loseWeight);
    const [isGoalToFeelBetter, setIsGoalToFeelBetter] = useState(currentUser.feelBetter);

    return (
        <View style={styles.container}>
            <View style={styles.topMenu}>
                <Image
                    source={require('./../../assets/images/clipboardgator.jpg')}
                    style={{width:55, height:55}}
                />
                <Text style={{fontSize: 25, fontFamily: 'System'}}>
                    Enter Progress
                </Text>
                <TouchableOpacity style = {styles.topIcons} activeOpacity={0.5}
                                  onPress={() => NavigateToNotifications(currentUser, navigation) }>
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{width:40, height:40, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
            </View>
            {isGoalToLoseWeight && (
                <View style = {styles.shadowContainerWeight}>
                    <Text style={{fontSize: 25, fontFamily: 'System', alignSelf: 'center',  marginTop: '5%'}}>
                        Enter New Weight:
                    </Text>
                    <View style = {styles.row}>
                    <TouchableOpacity style = {styles.weightIcons} activeOpacity={0.5}
                                    onPress={() => setNewWeight((Math.floor(newWeight)-1)) }>
                        <Image
                            source={require('./../../assets/images/progresslogging/minus.png')}
                            style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                        />
                    </TouchableOpacity>
                        <Text style={{fontSize: 25, fontFamily: 'System', alignSelf: 'center'}}>
                            {newWeight}
                        </Text>
                    <TouchableOpacity style = {styles.weightIcons} activeOpacity={0.5}
                                    onPress={() => setNewWeight((Math.floor(newWeight)+1)) }>
                        <Image
                            source={require('./../../assets/images/progresslogging/plus.png')}
                            style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                        />
                    </TouchableOpacity>
                    </View>
                </View>
            )}

            {isGoalToFeelBetter && (
            <View style = {styles.shadowContainerRating}>
                <Text style={{fontSize: 25, fontFamily: 'System', alignSelf: 'center', marginTop: '5%'}}>
                    How are you feeling?
                </Text>
                <StarRating style = {styles.stars}
                    enableHalfStar={false}
                    rating={rating}
                    onChange={(newRating) => setRating(newRating)}
                />
            </View>
            )}

            <TouchableOpacity style = {[styles.confirmButton, {alignSelf: 'center'} ]} activeOpacity={0.5}
                              onPress={() => ConfirmChanges(navigation, rating, newWeight, currentUser) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Submit Assessment
                </Text>
            </TouchableOpacity>

            <View style={styles.bottomMenu}>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => NavigateToHomePage(currentUser, navigation)}>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/homeIcon.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => NavigateToGameSchedule(currentUser, navigation)}>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/calendarIcon.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/plus.png')}
                        style={{width:45, height:45, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => NavigateToProfileManagement(currentUser, navigation) }>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/defaultprofile.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => LogoutPopup(navigation) }>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/logoutIcon.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}


function ConfirmChanges(navigation: any, rating: number, newWeight: any, currentUser: User){

    // Set goal type for this log entry
    if (currentUser.feelBetter && currentUser.loseWeight) {
        currentUser.goalType = 'both';
    } else if (currentUser.loseWeight) {
        currentUser.goalType = 'loseWeight';
    } else if (currentUser.feelBetter) {
        currentUser.goalType = 'feelBetter';
    }
    Alert.alert(
        "Confirmation",
        "Are you sure you want to log this data?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Confirm Changes",
                style: "destructive",
                onPress: () => {
                    currentUser.currentWeight = newWeight;
                    // API call via addUserProgress 
                    navigation.navigate('HomePage', {currentUser} as never);
                }
            }
        ]
    );
    if (currentUser.goalWeight && newWeight < currentUser.goalWeight){
        Alert.alert(
            "Confirmation",
            "Congratulations!! You have reached your weight goal. We'll reset your goal to feel-better only for now. Please continue to the profile management screen to update your goals.",
            [
                {
                    //text: "Nevermind!!",
                    //style: "cancel"
                },
                {
                    text: "Continue",
                    style: "destructive",
                    onPress: async () => {
                        currentUser.currentWeight = newWeight;
                        // Reset the goal types & give the user the option to reset it in the profile management screen.
                        // As a safety measure, since the user has to have a goal, we'll flag currentUser's feelBetter as true and loseWeight as false
                        let newFeelBetter = true;
                        let newLoseWeight = false;
                        await updateUserGoals(currentUser, newFeelBetter, newLoseWeight, navigation);                        
                    }
                }
            ]
        );
    }
}
function LogoutPopup(navigation: any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want logout?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                    // Navigate back to the welcome page.
                    console.log("Logging out.");
                    navigation.navigate('CreateOrSignIn' as never);
                }
            }
        ]
    );
}
function NavigateToGameSchedule(currentUser:any, navigation:any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want to abandon your changes?",
        [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                    navigation.navigate('GameSchedule', {currentUser} as never)
                }
            }
        ]
    );
}
function NavigateToProfileManagement(currentUser:any, navigation:any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want to abandon your changes?",
        [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                    navigation.navigate('ProfileManagement', {currentUser} as never)
                }
            }
        ]
    );
}
function NavigateToHomePage(currentUser:any, navigation:any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want to abandon your changes?",
        [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                    navigation.navigate('HomePage', {currentUser} as never)
                }
            }
        ]
    );
}
function NavigateToNotifications(currentUser:any, navigation:any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want to abandon your changes?",
        [
            {
                text: "No",
                style: "cancel"
            },
            {
                text: "Yes",
                style: "destructive",
                onPress: () => {
                    navigation.navigate('NotificationsPage', {currentUser} as never)
                }
            }
        ]
    );
}

function addUserProgress(navigation: any, currentUser: any){
    // UserData POST API call
    console.log("UserID = ", currentUser.userId) // TO DELETE
    const createUserDataUrl = `${AppUrls.url}/api/users/${currentUser.userId}/recordData/`;
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

const updateUserGoals = async (currentUser: any, newFeelBetter: boolean, newLoseWeight: boolean, navigation: any) => {
    const updatedData = {
        goal_to_feel_better: newFeelBetter,
        goal_to_lose_weight: newLoseWeight,
    };
    console.log("API Request Body: ", JSON.stringify(updatedData));

    try {
        const response = await fetch(`${AppUrls.url}/api/users/${currentUser.userId}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            Alert.alert('Goals updated successfully!');
            //If API call is successful, update the currentUser in the frontend & navigate to the profile management page so the user can further define their goals
            currentUser.loseWeight = false;
            currentUser.goal_to_lose_weight = false;
            currentUser.loseWeight = false;
            currentUser.goal_to_lose_weight = false; 
            console.log("Current user after API call & updates: ", currentUser);
            // Navigate back to the welcome page.
            navigation.navigate('ProfileManagement', {currentUser} as never);
        } else {
            const errorData = await response.json();
            Alert.alert('Error updating goals', JSON.stringify(errorData));
        }
    } catch (error) {
        console.error('Network error: ', error);
        Alert.alert("Network error");
    }
};

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
    bottomMenu:{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: '5%',
        width: '100%',
    },
    confirmButton:{
        borderWidth:1,
        borderColor:'orange',
        width:200,
        height:50,
        backgroundColor:'#ADD8E6',
        borderRadius:50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: '10%'
    },
    topIcons:{
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor:'#fae7d7',
        borderRadius: 40,
        height: 50,
        width: 50,
    },
    weightIcons:{
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor:'cream',
        borderRadius: 40,
        height: 30,
        width: 30,
    },
    stars:{
        marginTop: '5%',
        alignSelf: 'center'
    },
    bottomIcons:{
        justifyContent: 'center',
        borderRadius: 40,
        height: 40,
        width: 40,
    },
    shadowContainerWeight: {
            width: '70%', // Adjust as needed
            height: '15%', // Adjust as needed
            borderRadius: 10,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 5, // For Android shadow
            marginTop: '15%',
           alignSelf: 'center'

    },
    shadowContainerRating: {
        width: '70%', // Adjust as needed
        height: '15%', // Adjust as needed
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        marginTop: '15%',
        alignSelf: 'center'

    },
    row:{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: '10%',
    },
});
import {StyleSheet, View, Text, TouchableOpacity, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useState} from "react";
import StarRating from 'react-native-star-rating-widget';
import User from "@/components/user";

export default function ProgressLogging() {
    const navigation = useNavigation();
    const route = useRoute();
    const { currentUser } = route.params as { currentUser: any };

    const [newWeight, setNewWeight] = useState(currentUser.currentWeight);
    const [rating, setRating] = useState(0);

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
                                  onPress={() => navigation.navigate('NotificationsPage' as never) }>
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{width:40, height:40, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
            </View>
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
    if (currentUser.goalWeight && newWeight < currentUser.goalWeight){
        //TODO: The user has met their weight goal!! Send a happy notification or alert and prompt them to the goal setting screen
        Alert.alert(
            "Confirmation",
            "Congratulations!! You have reached your weight goal. Please continue to the goal editing screen to select a new goal.",
            [
                {
                    text: "Nevermind!!",
                    style: "cancel"
                },
                {
                    text: "Continue",
                    style: "destructive",
                    onPress: () => {
                        currentUser.currentWeight = newWeight;
                        //Reset the goal types & give the user the option to reset it in the profile management screen.
                        currentUser.loseWeight = false;
                        currentUser.goal_to_lose_weight = false;
                        currentUser.goalType = "feel better";
                        navigation.navigate('ProfileManagement', {currentUser} as never);
                    }
                }
            ]
        );
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
                    //TODO: SAVE THE RATING DATA IN THE DB
                    currentUser.currentWeight = newWeight;
                    navigation.navigate('HomePage', {currentUser} as never);
                }
            }
        ]
    );
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
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useState} from "react";
import {TeamLogo} from "@/components/getTeamImages";
import User from "@/components/user";


export default function HomePage() {
    const navigation = useNavigation();
    const route = useRoute();
    const user: any = route.params;
    const currentUser: User = user.currentUser.cloneUser(); //This fixes the nesting issue
    //console.log("User Data:" + JSON.stringify(currentUser));

    let currentOpponent = GetCurrentOpponentName();
    let CurrentOpponentFullName = GetCurrentOpponentFullName();
    let OpponentLogo = TeamLogo.GetImage(
        `${currentOpponent}`,
    );
    let CurrentGameData = GetCurrentScoreAndTime();

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
                                  onPress={() => NavigateToNotifications(currentUser, navigation) }>
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{width:40, height:40, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.middleContent}>
                <View style={styles.scoreBox}>
                    <View style={{flex:1,alignItems:'center',justifyContent:'space-evenly'}}>
                    <Image
                        source={require('../../assets/images/teamLogos/gatorlogo.png')}
                        style={{width:100, height:100, objectFit: 'contain'}}
                    />
                        <Text style={{fontSize: 15, fontFamily: 'System', alignSelf:'center'}}>
                            University of Florida
                        </Text>
                    </View>
                    <View style={styles.scoreBoxText}>
                    <Text style={{fontSize: 20, fontFamily: 'System', marginTop: 40, alignSelf:'center'}}>
                       {CurrentGameData[0]} - {CurrentGameData[1]}
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', marginTop: 40, alignSelf:'center'}}>
                        Q{CurrentGameData[2]} - {CurrentGameData[3]}:{CurrentGameData[4]}
                    </Text>
                    </View>
                    <View style={{flex:1,alignItems:'center',justifyContent:'space-evenly'}}>
                    <Image
                        source={OpponentLogo}
                        style={{width:100, height:100, objectFit: 'contain'}}
                    />
                        <Text style={{fontSize: 15, fontFamily: 'System', alignSelf:'center'}}>
                            {CurrentOpponentFullName}
                        </Text>
                    </View>

                </View>

            </View>
            <Text style={{fontSize: 15, fontFamily: 'System', marginTop: 50, alignSelf:'center'}}>
                Welcome to the placeholder home screen!
            </Text>
            <View style={styles.bottomMenu}>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}>
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
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => navigation.navigate('HomePage' as never) }>
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
                                  onPress={() => LogoutPopup(navigation)}>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/logoutIcon.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>

            </View>
        </View>
    );
}

function NavigateToGameSchedule(currentUser:any, navigation:any){
    navigation.navigate('GameSchedule', {currentUser} as never)
}
function NavigateToNotifications(currentUser:any, navigation:any){
    navigation.navigate('NotificationsPage', {currentUser} as never)
}
function NavigateToProfileManagement(currentUser:any, navigation:any){
    navigation.navigate('ProfileManagement', {currentUser} as never)
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


//TODO: call backend API to get who we are playing next
function GetCurrentOpponentName():string{
    //Call the API to find out what game is next. Use this to choose the image.

    //TEMP: ASSUME we are playing FSU.
    return 'fsu';
}

//TODO: call backend API to get who we are playing next
function GetCurrentOpponentFullName():string{
    //TEMP: ASSUME we are playing FSU.
    return 'Florida State University';
}
/*
Returns [gators' current score, opponent's current score, current quarter,
        minutes remaining in the quarter, seconds remaining in the quarter]
 */
function GetCurrentScoreAndTime():[number, number, number, number, number]{
//TODO: Connect to backend API
    return [0,0,0,15,0];
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
    topIcons:{
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor:'#fae7d7',
        borderRadius: 40,
        height: 50,
        width: 50,
    },
    bottomIcons:{
        justifyContent: 'center',
        borderRadius: 40,
        height: 40,
        width: 40,
    },
    middleContent:{
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: '20%',
    },
    scoreBox:{
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderWidth: 1.5,
        borderRadius: 30,
        borderColor: 'grey',
        width: '90%',
        alignSelf: 'center'
    },
    scoreBoxText:{
        flexDirection: 'column',
    }
});
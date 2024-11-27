import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, usePreventRemove, useRoute, useFocusEffect} from "@react-navigation/native";
import React, {useState, useEffect} from "react";
import {TeamLogo} from "@/components/getTeamImages";
import User from "@/components/user";
import { AppUrls } from '@/constants/AppUrls';
import { Abbreviations } from '@/constants/Abbreviations';

export default function HomePage() {
    const navigation = useNavigation();
    const route = useRoute();
    const { currentUser } = route.params as { currentUser: any };

    // State to store the fetched game data
    const [gameData, setGameData] = useState({
        home_team: '',
        away_team: '',
        date: ''
    });

    // Fetch game data when the component is mounted
    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const data = await getNextGame();
                if (data) {
                    setGameData({
                        home_team: data.home_team,
                        away_team: data.away_team,
                        date: data.date
                    });
                }
            } catch (error) {
                console.error('Error fetching game data:', error);
            }
        };

        fetchGameData();
    }, []);  // Empty dependency array to fetch only on mount

     // Convert team names to abbreviations
     const getAbbreviation = (teamName: string): string | null => {
        return Abbreviations[teamName] || null;
    };

     // Fetch team logos based on the fetched game data
     const HomeLogo = TeamLogo.GetImage(getAbbreviation(gameData.home_team)?.toLowerCase() || "");
     const OpponentLogo = TeamLogo.GetImage(getAbbreviation(gameData.away_team)?.toLowerCase() || "");

    //let currentOpponent = GetCurrentOpponentName();
    //let CurrentOpponentFullName = GetCurrentOpponentFullName();
    //let OpponentLogo = TeamLogo.GetImage(
    //    `${currentOpponent}`,
    //);
    //let CurrentGameData = GetCurrentScoreAndTime();

    //The following function prevents the user from going backwards a screen.
    usePreventRemove(true, ({ data }) => {
        //console.log("Back button prevented.");
    });

    //Gets text to display in goals box depending on goal progress
    function GetGoalsText(): string{
        if(currentUser.goal_to_lose_weight){
            // @ts-ignore
            return "Weight left to lose: " + Math.floor(currentUser.currentWeight - currentUser.goalWeight) + " pounds";
        }
        else
            return "Keep at it!";
    }

    //Gets text to display for goal type
    function GetGoals(): string{
        if(currentUser.feelBetter && currentUser.loseWeight){
            return "Lose weight and feel better";
        }
        else if(currentUser.feelBetter && !currentUser.loseWeight){
            return "Feel better";
        }
        else { //(!currentUser.feelBetter && currentUser.loseWeight)
            return "Lose weight";
        }
    }

    // **CHANGED RETURN STATEMENT**: Updated to include fallback text for missing logos
    return (
        <View style={styles.container}>
            <View style={styles.topMenu}>
                <Image
                    source={require('./../../assets/images/clipboardgator.jpg')}
                    style={{ width: 55, height: 55 }}
                />
                <Text style={{ fontSize: 25, fontFamily: 'System' }}>
                    Hey, {currentUser.firstName}!
                </Text>
                <TouchableOpacity
                    style={styles.topIcons}
                    activeOpacity={0.5}
                    onPress={() => NavigateToNotifications(currentUser, navigation)}
                >
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{ width: 40, height: 40, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
            {/* **UPDATED MIDDLE CONTENT**: Dynamically render team logos and fallback text */}
            <View style={styles.middleContent}>
                <View style={styles.scoreBox}>
                    {/* Home Team */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                        {HomeLogo ? (
                            <Image source={HomeLogo} style={{ width: 100, height: 100 }} />
                        ) : (
                            <Text>No Logo Found</Text>
                        )}
                        <Text style={{ fontSize: 15 }}>{gameData.home_team}</Text>
                    </View>
                    {/* Game Info */}
                    <View style={styles.scoreBoxText}>
                        <Text style={{ fontSize: 20 }}>{gameData.home_team} vs {gameData.away_team}</Text>
                        <Text style={{ fontSize: 20 }}>{gameData.date}</Text>
                    </View>
                    {/* Away Team */}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}>
                        {OpponentLogo ? (
                            <Image source={OpponentLogo} style={{ width: 100, height: 100 }} />
                        ) : (
                            <Text>No Logo Found</Text>
                        )}
                        <Text style={{ fontSize: 15 }}>{gameData.away_team}</Text>
                    </View>
                </View>
            </View>
            <View style={styles.weightBox}>
                <Text style={{ fontSize: 20, textAlign: 'center' }}>Current Goals: {GetGoals()}</Text>
                <Text style={{ fontSize: 20 }}>Current Weight: {currentUser.currentWeight}</Text>
                <Text style={{ fontSize: 20 }}>{GetGoalsText()}</Text>
            </View>
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.bottomIcons} activeOpacity={0.5}>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/homeIcon.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomIcons}
                    activeOpacity={0.5}
                    onPress={() => NavigateToGameSchedule(currentUser, navigation)}
                >
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/calendarIcon.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomIcons}
                    activeOpacity={0.5}
                    onPress={() => NavigateToProcessLogging(currentUser, navigation)}
                >
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/plus.png')}
                        style={{ width: 45, height: 45, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomIcons}
                    activeOpacity={0.5}
                    onPress={() => NavigateToProfileManagement(currentUser, navigation)}
                >
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/defaultprofile.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.bottomIcons}
                    activeOpacity={0.5}
                    onPress={() => LogoutPopup(navigation)}
                >
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/logoutIcon.png')}
                        style={{ width: 30, height: 30, alignSelf: 'center', objectFit: 'contain' }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

   //return (
   //    <View style={styles.container}>
   //        <View style={styles.topMenu}>
   //            <Image
   //                source={require('./../../assets/images/clipboardgator.jpg')}
   //                style={{width:55, height:55}}
   //            />
   //            <Text style={{fontSize: 25, fontFamily: 'System'}}>
   //                Hey, {currentUser.firstName}!
   //            </Text>
   //            <TouchableOpacity style = {styles.topIcons} activeOpacity={0.5}
   //                              onPress={() => NavigateToNotifications(currentUser, navigation) }>
   //                <Image
   //                    source={require('./../../assets/images/bell.png')}
   //                    style={{width:40, height:40, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //        </View>
   //        <View style={styles.middleContent}>
   //            <View style={styles.scoreBox}>
   //                <View style={{flex:1,alignItems:'center',justifyContent:'space-evenly'}}>
   //                <Image
   //                    source={HomeLogo}  // Dynamically use home team logo
   //                    style={{width:100, height:100, objectFit: 'contain'}}
   //                />
   //                    <Text style={{fontSize: 15, fontFamily: 'System', alignSelf:'center'}}>
   //                        {gameData.home_team}  {/* Dynamically display home team */}
   //                    </Text>
   //                </View>
   //                <View style={styles.scoreBoxText}>
   //                <Text style={{fontSize: 20, fontFamily: 'System', marginTop: 40, alignSelf:'center'}}>
   //                   {gameData.home_team} vs {gameData.away_team}
   //                </Text>
   //                <Text style={{fontSize: 20, fontFamily: 'System', marginTop: 40, alignSelf:'center'}}>
   //                    {gameData.date}  {/* Dynamically display the date */}
   //                </Text>
   //                </View>
   //                <View style={{flex:1,alignItems:'center',justifyContent:'space-evenly'}}>
   //                <Image
   //                    source={OpponentLogo}  // Dynamically use away team logo
   //                    style={{width:100, height:100, objectFit: 'contain'}}
   //                />
   //                    <Text style={{fontSize: 15, fontFamily: 'System', alignSelf:'center'}}>
   //                        {gameData.away_team}  {/* Dynamically display away team */}
   //                    </Text>
   //                </View>
   //            </View>
   //        </View>
   //        <View style={styles.weightBox}>
   //            <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center', textAlign:'center'}}>
   //                Current Goals: {GetGoals()}
   //            </Text>
   //            <Text style={{fontSize: 20, fontFamily: 'System',alignSelf:'center'}}>
   //                Current Weight: {currentUser.currentWeight}
   //            </Text>
   //            <Text style={{fontSize: 20, fontFamily: 'System',alignSelf:'center'}}>
   //                {GetGoalsText()}
   //            </Text>
   //        </View>
   //        <View style={styles.bottomMenu}>
   //            <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}>
   //                <Image
   //                    source={require('../../assets/images/bottomHomeMenu/homeIcon.png')}
   //                    style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //            <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
   //                              onPress={() => NavigateToGameSchedule(currentUser, navigation)}>
   //                <Image
   //                    source={require('../../assets/images/bottomHomeMenu/calendarIcon.png')}
   //                    style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //            <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
   //                              onPress={() => NavigateToProcessLogging(currentUser, navigation) }>
   //                <Image
   //                    source={require('../../assets/images/bottomHomeMenu/plus.png')}
   //                    style={{width:45, height:45, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //            <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
   //                              onPress={() => NavigateToProfileManagement(currentUser, navigation) }>
   //                <Image
   //                    source={require('../../assets/images/bottomHomeMenu/defaultprofile.png')}
   //                    style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //            <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
   //                              onPress={() => LogoutPopup(navigation)}>
   //                <Image
   //                    source={require('../../assets/images/bottomHomeMenu/logoutIcon.png')}
   //                    style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
   //                />
   //            </TouchableOpacity>
   //        </View>
   //    </View>
   //);
//}

function NavigateToGameSchedule(currentUser:any, navigation:any){
    navigation.navigate('GameSchedule', {currentUser} as never)
}
function NavigateToNotifications(currentUser:any, navigation:any){
    navigation.navigate('NotificationsPage', {currentUser} as never)
}
function NavigateToProfileManagement(currentUser:any, navigation:any){
    navigation.navigate('ProfileManagement', {currentUser} as never)
}
function NavigateToProcessLogging(currentUser:any, navigation:any){
    navigation.navigate('ProcessLogging', {currentUser} as never)
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

export const getNextGame = async () => {
    try {
        const response = await fetch(`${AppUrls.url}/home-tile/`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        if (response.ok) {
            //let home = Abbreviations[data.home_team] || 'Unknown';
            //let away = Abbreviations[data.away_team] || 'Unknown';
            // Sample data format: {"away_team": "Florida", "date": "11-30-2024 07:00 PM", "home_team": "Florida State"}
            return data; // Expected format: {home_team, away_team, date}   
        } 
        //return data;
    } 
    catch (error) {
        console.error('Error getting next game:', error);
    }
};

//TODO: call backend API to get who we are playing next
function GetCurrentOpponentName():string{
    
    // First see if there's a live game.

    // If there's not a live game, get the next game.
    let home = '';
    let away = '';
    let date = new Date();
    getNextGame();

    return 'away';   
}

function getTeamAcronym(teamName: string){
    const abbreviation = Abbreviations[teamName] || 'Unknown';
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
        borderRadius: 10,
        borderColor: 'white',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    scoreBoxText:{
        flexDirection: 'column',
    },
    weightBox:{
        flexDirection:'column',
        width: '80%', // Adjust as needed
        height: '20%', // Adjust as needed
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        marginTop: '15%',
        alignSelf: 'center',
        justifyContent:'space-around',
    }
});
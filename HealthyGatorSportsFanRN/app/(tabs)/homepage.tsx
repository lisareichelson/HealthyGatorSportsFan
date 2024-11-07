import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {TeamLogo} from "@/components/getTeamImages";


export default function HomePage() {
    const navigation = useNavigation();

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
                                  onPress={() => navigation.navigate('NotificationsPage' as never) }>
                    <Image
                        source={require('./../../assets/images/defaultprofile.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.topIcons} activeOpacity={0.5}
                                  onPress={() => navigation.navigate('NotificationsPage' as never) }>
                    <Image
                        source={require('./../../assets/images/bell.png')}
                        style={{width:30, height:30, alignSelf: 'center', objectFit: 'contain'}}
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
        </View>
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
    topIcons:{
        justifyContent: 'center',
        borderColor: 'grey',
        borderWidth: 1,
        backgroundColor:'#fae7d7',
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
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import {TeamLogo} from "@/components/getTeamImages";


export default function HomePage() {
    const navigation = useNavigation();
    const currentOpponent = GetCurrentOpponentName();
    const test = `../../assets/images/teamLogos/${currentOpponent}.png`;
    const OpponentLogo = TeamLogo.GetImage(
        `${currentOpponent}.png`,
    );
    console.log("Current logo: " + JSON.stringify(OpponentLogo));
    //const imgFolder = require.context('../../assets/images/teamLogos/', false);
    //const img_node = images(`./${currentOpponent}.png`);
    //return <img src={img_node}/>;
   // const images = require.context('../../assets/images/teamLogos/', true);
   // const loadImage = (currentOpponent: any) => (images(`./${currentOpponent}`));
   // <img src={loadImage("someimage.png")} alt="" />

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
                    <Image
                        source={require('../../assets/images/teamLogos/gatorlogo.png')}
                        style={{width:100, height:100, objectFit: 'contain'}}
                    />
                    <Image
                        source={OpponentLogo}
                        style={{width:100, height:100, objectFit: 'contain'}}
                    />

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
        justifyContent: 'space-between'

    }
});
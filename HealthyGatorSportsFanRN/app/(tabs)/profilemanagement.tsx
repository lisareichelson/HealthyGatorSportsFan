import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import User from "@/components/user";

export default function ProfileManagement() {
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params;
    const user: any = route.params;
    const currentUser: User = user.currentUser.cloneUser(); //This fixes the nesting issue
   // console.log("User Data profile management:" + JSON.stringify(currentUser));


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
            <View style = {styles.personalDetails}>
                <Text style={{fontSize: 15, fontFamily: 'System', color:'grey', alignSelf:'center'}}>
                    Personal Details
                </Text>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 15, fontFamily: 'System'}}>
                        Name
                    </Text>
                    <Text style={{fontSize: 15, fontFamily: 'System', alignSelf:'center'}}>
                        {currentUser.firstName} {currentUser.lastName}
                    </Text>
                </TouchableOpacity>

            </View>


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
                                  onPress={() => NavigateToHomePage(currentUser, navigation) }>
                    <Image
                        source={require('../../assets/images/bottomHomeMenu/plus.png')}
                        style={{width:45, height:45, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}>
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
function NavigateToHomePage(currentUser:any, navigation:any){
    navigation.navigate('GameSchedule', {currentUser} as never)
}
function NavigateToNotifications(currentUser:any, navigation:any){
    navigation.navigate('NotificationsPage', {currentUser} as never)
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
    personalDetails:{
        flexDirection: 'column',
        justifyContent: 'space-around',
        marginTop: '20%',
    },
    row:{
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-around',
        borderWidth: 1.5,
        width: '90%',

    }

});
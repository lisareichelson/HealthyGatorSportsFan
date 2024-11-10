import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import User from "@/components/user";
import {useState} from "react";

export default function ProfileManagement() {
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params;
    const user: any = route.params;
    const currentUser: User = user.currentUser.cloneUser(); //This fixes the nesting issue
   // console.log("User Data profile management:" + JSON.stringify(currentUser));

    const [showEditName, setShowEditName] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');


    return (
        <View style={styles.container}>
            <View style={styles.topMenu}>
                <Image
                    source={require('./../../assets/images/clipboardgator.jpg')}
                    style={{width:55, height:55}}
                />
                <Text style={{fontSize: 20, fontFamily: 'System'}}>
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
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                onPress={() => setShowEditName(!showEditName)}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Name
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {currentUser.firstName} {currentUser.lastName}
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                {showEditName && (
                    <TextInput
                        style={styles.editBox}
                        placeholder="First Name"
                        editable={true}
                        value={newFirstName}
                        defaultValue={currentUser.firstName}
                        onChangeText={newFirst => setNewFirstName(newFirst)}
                    />
                )}
                {showEditName && (
                    <TextInput
                        style={styles.editBox}
                        placeholder="Last Name"
                        editable={true}
                        value={newLastName}
                        defaultValue={currentUser.lastName}
                        onChangeText={newLast => setNewLastName(newLast)}
                    />
                )}
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Height
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {currentUser.heightFeet}'{currentUser.heightInches}"
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Current Weight
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {currentUser.currentWeight}
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Gender
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {currentUser.gender}
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <Text style={{fontSize: 15, fontFamily: 'System', color:'grey', alignSelf:'center'}}>
                    Goals
                </Text>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Goal(s)
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {GetGoalsText(currentUser)}
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>
                        Goal Weight
                    </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System', alignSelf:'center'}}>
                        {GetGoalWeightStr(currentUser)}
                    </Text>
                    <Image
                        source={require('../../assets/images/editPencil.png')}
                        style={{width:20, height:20, alignSelf: 'center', objectFit: 'contain'}}
                    />
                </TouchableOpacity>

            </View>

            <TouchableOpacity style = {[styles.confirmButton, {marginTop: 100, alignSelf: 'center'} ]} activeOpacity={0.5}
                              onPress={() => ConfirmChanges(currentUser, newFirstName, newLastName, navigation) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Create Account
                </Text>
            </TouchableOpacity>


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

function ConfirmChanges(currentUser:User, newFirstName: any, newLastName: any, navigation: any){
    Alert.alert(
        "Confirmation",
        "Are you sure you want to make these changes?",
        [
            {
                text: "Cancel",
                style: "cancel"
            },
            {
                text: "Confirm Changes",
                style: "destructive",
                onPress: () => {
                    // Navigate back to the welcome page.
                    console.log("Changing User Data");
                    //Save the altered currentUser & send it back to the home page
                    if(newFirstName != '')
                        currentUser.firstName = newFirstName;
                    if(newLastName != '')
                        currentUser.lastName = newLastName;

                    navigation.navigate('HomePage', {currentUser} as never);
                }
            }
        ]
    );

}

function GetGoalWeightStr(currentUser: User): String{
    if(currentUser.loseWeight){
        return String(currentUser.goalWeight);
    }
    else
        return "N/A";
}

function GetGoalsText(currentUser: User):String{
    let goalStr: String = "";
    if (currentUser.loseWeight){
        goalStr += "Lose Weight";
        if (currentUser.feelBetter){
            goalStr +=" & Feel Better";
        }
    }
    else{
        if(currentUser.feelBetter) {
            goalStr = "Feel Better";
        }
        else goalStr = "None";
    }
    return goalStr;
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
        justifyContent: 'space-between',
        borderWidth: 1.5,
        width: '90%',
        borderColor: 'grey',
        margin: 5,
    },
    editBox:{
        borderWidth: 1,
        width: '80%',
        marginRight: '5%',
        alignSelf: 'flex-end',
        margin: 5,
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
    },

});
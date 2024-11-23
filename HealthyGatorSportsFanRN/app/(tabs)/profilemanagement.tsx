import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation, usePreventRemove, useRoute} from "@react-navigation/native";
import User from "@/components/user";
import {useState} from "react";
import {Dropdown} from "react-native-element-dropdown";
import Checkbox from "expo-checkbox";

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

    const [showEditHeight, setShowEditHeight] = useState(false);
    const [heightInch, setHeightInches] = useState('');
    const [heightFt, setHeightFeet] = useState('');
    const [newHeightFeet] = useState([
        {value: '1'},
        {value: '2'},
        {value: '3'},
        {value: '4'},
        {value: '5'},
        {value: '6'},
        {value: '7'},
        {value: '8'}
    ]);
    const [newHeightInches] = useState([
        {value: '1'},
        {value: '2'},
        {value: '3'},
        {value: '4'},
        {value: '5'},
        {value: '6'},
        {value: '7'},
        {value: '8'},
        {value: '9'},
        {value: '10'},
        {value: '11'}
    ]);

    const [showEditWeight, setShowEditWeight] = useState(false);
    const [newWeight, setNewWeight] = useState('');

    const [genders] = useState([
        {label: 'Male', value: 'male'},
        {label: 'Female', value: 'female'},
        {label: 'Other', value: 'other'}
    ]);
    const [showEditGender, setShowEditGender] = useState(false);
    const [newGender, setNewGender] = useState('');

    const [showEditGoals, setShowEditGoals] = useState(false);
    const [feelBetter, setFeelBetter] = useState(false);
    const [loseWeight, setLoseWeight] = useState(false);

    const [showEditGoalWeight, setShowEditGoalWeight] = useState(false);
    const [goalWeight, setGoalWeight] = useState('');

    function dataEntered():boolean{
        if (newFirstName != ''|| newLastName != '')
            return true;
        if (heightFt.valueOf() != '' || heightInch.valueOf() != '')
            return true;
         if (newWeight.valueOf() != '')
             return true;
         if (newGender != '')
             return true;
         if (feelBetter)
             return true;
         if (loseWeight)
             return true;

        return goalWeight.valueOf() != '';
    }

    //The following function prevents the user from going backwards a screen ONLY IF data has been entered.
    usePreventRemove(dataEntered(), ({ data }) => {
        //console.log("Back button prevented.");
    });

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
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                                  onPress={() => setShowEditHeight(!showEditHeight)}>
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
                {showEditHeight && (<View style = {styles.rowHeight}>
                    <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Feet:</Text>
                    <Dropdown style={[styles.dropdown, {width: '30%'}]}
                              data={newHeightFeet}
                              labelField={"value"}
                              valueField={"value"}
                              accessibilityLabel="Dropdown menu for selecting height in feet"
                              onChange={item => { setHeightFeet(item.value);}}
                              renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
                    ></Dropdown>

                    <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Inches:</Text>
                    <Dropdown style={[styles.dropdown, {width: '30%'}]}
                              data={newHeightInches}
                              labelField={"value"}
                              valueField={"value"}
                              accessibilityLabel="Dropdown menu for selecting additional height in inches"
                              onChange={item => {setHeightInches(item.value);}}
                              renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
                    ></Dropdown>
                </View>)}

                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                                  onPress={() => setShowEditWeight(!showEditWeight)}>
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
                {showEditWeight &&(
                    <TextInput
                        style={styles.editBox}
                        placeholder="enter a weight..."
                        keyboardType={"numeric"}
                        editable={true}
                        value={newWeight}
                        defaultValue={newWeight}
                        onChangeText={newWeight => setNewWeight(newWeight)}
                        returnKeyType="done"/>
                )}
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                                  onPress={() => setShowEditGender(!showEditGender)}>
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
                {showEditGender && (
                    <Dropdown style={[styles.dropdown]}
                              data={genders}
                              labelField={"label"}
                              valueField={"value"}
                              accessibilityLabel="Dropdown menu for selecting gender"
                              onChange={item => {setNewGender(item.value);}}
                    ></Dropdown>
                )}
                <Text style={{fontSize: 15, fontFamily: 'System', color:'grey', alignSelf:'center'}}>
                    Goals
                </Text>
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                    onPress={() => setShowEditGoals(!showEditGoals)}>
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
                {showEditGoals && (
                    <View style = {[styles.row, {justifyContent: 'space-evenly'}]}>
                        <Text style={{fontSize: 10, fontFamily: 'System', color: 'grey', alignSelf: 'center'}}>
                            Feel Better:
                        </Text>
                        <Checkbox value={loseWeight} onValueChange={setLoseWeight} />
                        <Text style={{fontSize: 10, fontFamily: 'System', color: 'grey', alignSelf: 'center'}}>
                            Lose Weight:
                        </Text>
                        <Checkbox value={feelBetter} onValueChange={setFeelBetter} />
                    </View>
                )}
                <TouchableOpacity style = {styles.row} activeOpacity={0.5}
                                  onPress={() => setShowEditGoalWeight(!showEditGoalWeight)}>
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
                {showEditGoalWeight && (
                   <TextInput
                            style={styles.editBox}
                            placeholder="enter a weight..."
                            keyboardType={"numeric"}
                            editable={true}
                            value={goalWeight}
                            defaultValue={goalWeight}
                            onChangeText={newWeight => setGoalWeight(newWeight)}
                            returnKeyType="done"/>
                )}
            </View>

            <TouchableOpacity style = {[styles.confirmButton, {alignSelf: 'center'} ]} activeOpacity={0.5}
                              onPress={() => ConfirmChanges(currentUser, newFirstName, newLastName, heightFt, heightInch, newWeight, newGender, feelBetter, loseWeight, goalWeight, navigation) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>
                    Confirm Changes
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
                <TouchableOpacity style = {styles.bottomIcons} activeOpacity={0.5}
                                  onPress={() => NavigateToProgressLogging(currentUser, navigation) }>
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

//TODO: Connect changes to backend
function ConfirmChanges(currentUser:User, newFirstName: any, newLastName: any, newFt: any, newInch: any, newWeight: any, newGender:any, loseWeight: any, feelBetter:any, newGoalWeight: any, navigation: any){
    let okayToContinue = true;
    if(newGoalWeight >= currentUser.currentWeight){
        Alert.alert("Goal weight must be less than current weight.");
        return;
    }
    if(newGoalWeight != '' && !currentUser.goal_to_lose_weight && loseWeight == false){
        okayToContinue = false;
        Alert.alert(
            "Confirmation",
            "You can't have a goal weight if your goal is not to lose weight!",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Okay",
                    style: "destructive",
                    onPress: () => {
                        // Manually select lose weight as a goal for the user.
                        loseWeight = true;
                        okayToContinue = true;
                    }
                }
            ]
        );
    }
    if (okayToContinue){
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
                        if (newFirstName != '')
                            currentUser.firstName = newFirstName;
                        if (newLastName != '')
                            currentUser.lastName = newLastName;
                        if (newFt != '')
                            currentUser.heightFeet = newFt;
                        if (newInch != '')
                            currentUser.heightInches = newInch;
                        if (newWeight != '')
                            currentUser.currentWeight = newWeight;
                        if (newGender != '')
                            currentUser.gender = newGender;
                        console.log(JSON.stringify(currentUser));
                        console.log("checkbox lW: " + loseWeight);
                        if (loseWeight != currentUser.loseWeight) //goal selection changed
                            currentUser.loseWeight = loseWeight;
                        if (feelBetter != currentUser.feelBetter) //goal selection changed
                            currentUser.feelBetter = feelBetter;
                        if (newGoalWeight != '') {
                            currentUser.goalWeight = newGoalWeight;
                        }

                        navigation.navigate('HomePage', {currentUser} as never);
                    }
                }
            ]
        );
    }

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
function NavigateToProgressLogging(currentUser:any, navigation:any){
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
                    navigation.navigate('ProcessLogging', {currentUser} as never)
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
    checkbox: {
        margin: 8,
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
    rowHeight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
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
    dropdown:{
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        width: '80%',
        marginRight: '5%',
        alignSelf: 'flex-end',
    },

});
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Image, Alert} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import {useState} from "react";
import Checkbox from 'expo-checkbox';

const GoalCollection = () => {
    const navigation = useNavigation();
    const [feelBetter, setFeelBetter] = useState(false);
    const [loseWeight, setLoseWeight] = useState(false);
    const [startWeight, setStartWeight] = useState('');
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
                    <Text style={{fontSize: 15, fontFamily: 'System'}}>Current Weight:   </Text>
                    <TextInput
                        style={styles.weightBox}
                        placeholder="enter a weight..."
                        keyboardType={"numeric"}
                        editable={true}
                        value={startWeight}
                        defaultValue={startWeight}
                        onChangeText={newWeight => setStartWeight(newWeight)}
                        onEndEditing={startWeight => SetStartWeightBackend(startWeight)}
                        returnKeyType="done"/>
                </View>
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
                        onEndEditing={goalWeight => SetGoalWeightBackend(goalWeight)}
                        returnKeyType="done"/>
                </View>
            </View>
            }

            <TouchableOpacity style = {[styles.bottomObject, {marginTop: 150} ]} activeOpacity={0.5}
                              onPress={() => confirmGoals(navigation, feelBetter, loseWeight, startWeight, goalWeight)}>
                <Image
                    source={require('./../../assets/images/forwardarrow.png')}
                    style={{width: 50, height: 50}}
                />
            </TouchableOpacity>
        </View>
    );
}

export default GoalCollection

function SetStartWeightBackend(weight: any){
    console.log(weight.nativeEvent.text);
}

function SetGoalWeightBackend(weight: any){
    console.log(weight.nativeEvent.text);
}

//TODO: Store goals from here into backend.
function confirmGoals(navigation: any, feelBetter: any, loseWeight: any, startWeight:any, goalWeight:any){

    //If losing weight is a goal
    if (loseWeight){
        if (goalWeight < loseWeight){
            Alert.alert("Current Weight cannot be less than goal weight.");
            return;
        }
    }
    navigation.navigate('HomePage' as never);
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
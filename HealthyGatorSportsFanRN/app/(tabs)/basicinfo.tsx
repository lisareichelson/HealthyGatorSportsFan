import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
  Platform,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import {useState} from "react";





export default function BasicInformationCollection() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const styles1 = SetStyles(width, height);
  const [genders] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'}
  ]);
  const [heightFeet] = useState([
    { value: 1},
    { value: 2},
    { value: 3},
    { value: 4},
    { value: 5},
    { value: 6},
    { value: 7},
    { value: 8}
  ]);
  const [heightInches] = useState([
    { value: 1},
    { value: 2},
    { value: 3},
    { value: 4},
    { value: 5},
    { value: 6},
    { value: 7},
    { value: 8},
    { value: 9},
    { value: 10},
    { value: 11},
    { value: 12}
  ]);
  const [weight, setWeight] = useState('');

  return (
      <View style={styles1.container}>
        <Text style={{fontSize: 35, fontFamily: 'System', textAlign: "center", justifyContent: "center", paddingTop: 100}}>Before we begin, we need some basic information.</Text>
        <Image style=
                   {{width: 150,
                    height: 150,}}
               source={require('./../../assets/images/clipboardgator.jpg')}/>
        <View style={styles1.InputBoxes}>
          <Text style={{fontSize: 20, fontFamily: 'System'}}>Select your gender:</Text>
          <Dropdown style={[styles1.dropdown]}
                    data={genders} labelField={"label"} valueField={"value"} onChange={item => {
            SetGenderValue(item.value);
          }}
          ></Dropdown>

          <Text style={{fontSize: 15, fontFamily: 'System'}}>Select your height in feet:</Text>
          <Dropdown style={[styles1.dropdown]}
                    data={heightFeet} labelField={"value"} valueField={"value"} onChange={item => {
            SetHeightValueFeet(item.value);
          }}
          ></Dropdown>

          <Text style={{fontSize: 15, fontFamily: 'System'}}>Select your height in inches:</Text>
          <Dropdown style={[styles1.dropdown]}
                    data={heightInches} labelField={"value"} valueField={"value"} onChange={item => {
            SetHeightValueInches(item.value);
          }}
          ></Dropdown>
          <Text style={{fontSize: 15, fontFamily: 'System'}}>Enter your weight in pounds:</Text>

          <TextInput
              style={styles1.inputWeight}
              placeholder="enter a weight..."
              keyboardType={"numeric"}
              editable={true}
              value={weight}
              onEndEditing={weight => SetWeightValue(weight)}
              returnKeyType="done"/>
        </View>

      </View>

  );
}

function SetWeightValue(weight: any){
  console.log(weight.valueOf());
}

function SetGenderValue(item: any) {
  console.log(item);
}

function SetHeightValueFeet(height: any){
  console.log(height);
}

function SetHeightValueInches(height: any){
  console.log(height);
}

function SetStyles(width: number, height: number) : any{
  const styles1 = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputWeight: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    InputBoxes: {
      flex: 1,
      justifyContent: "center",
      paddingBottom: height/4
    },
    TopBox: {
      position: 'absolute',
      bottom: height/1.65,
    },
    Height:{
      position: 'absolute',
      bottom: height/2,
    },
    middleBox: {
      position: 'absolute',
      bottom: height/3,
      left: width - width/3,
    },
    bottomObject: {
      position: 'absolute',
      bottom: 10,
      left: 320,
      right: 0,
    },
    dropdown:{
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
  });
  return styles1;
}


const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});

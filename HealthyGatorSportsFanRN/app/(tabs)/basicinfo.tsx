import {
  StyleSheet,
  View,
  Text,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import {useState} from "react";
//To focus on the weight input box while it's being entered, use: https://github.com/APSL/react-native-keyboard-aware-scroll-view

 const BasicInformationCollection = () => {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const styles = SetStyles(width, height);
  const [genders] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
    {label: 'Other', value: 'other'}
  ]);
  const [heightFeet] = useState([
    { value: '1'},
    { value: '2'},
    { value: '3'},
    { value: '4'},
    { value: '5'},
    { value: '6'},
    { value: '7'},
    { value: '8'}
  ]);
  const [heightInches] = useState([
    { value: '1'},
    { value: '2'},
    { value: '3'},
    { value: '4'},
    { value: '5'},
    { value: '6'},
    { value: '7'},
    { value: '8'},
    { value: '9'},
    { value: '10'},
    { value: '11'},
    { value: '12'}
  ]);
  const [weight] = useState('');

  return (
      <View style={styles.container}>
        <Text style={{fontSize: 35, fontFamily: 'System', textAlign: "center", justifyContent: "center", paddingTop: 100}}>Before we begin, we need some basic information.</Text>
        <Image style=
                   {{width: 150,
                    height: 150,}}
               source={require('./../../assets/images/clipboardgator.jpg')}/>
        <View style={styles.InputBoxes}>
          <Text style={{fontSize: 20, fontFamily: 'System'}}>Select your gender:</Text>
          <Dropdown style={[styles.dropdown]}
                    data={genders} 
                    labelField={"label"} 
                    valueField={"value"} 
                    accessibilityLabel="Dropdown menu for selecting gender"
                    onChange={item => {SetGenderValue(item.value);}}
          ></Dropdown>

          <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Select your height in feet:</Text>
          <Dropdown style={[styles.dropdown]}
                    data={heightFeet} 
                    labelField={"value"} 
                    valueField={"value"} 
                    accessibilityLabel="Dropdown menu for selecting height in feet"
                    onChange={item => { SetHeightValueFeet(item.value);}}
                    renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
          ></Dropdown>

          <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Select your height in inches:</Text>
          <Dropdown style={[styles.dropdown]}
                    data={heightInches} 
                    labelField={"value"} 
                    valueField={"value"} 
                    accessibilityLabel="Dropdown menu for selecting additional heigh in inches"
                    onChange={item => {SetHeightValueInches(item.value);}}
                    renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
          ></Dropdown>
          
          <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Enter your weight in pounds:</Text>
          <TextInput
              style={styles.inputWeight}
              placeholder="enter a weight..."
              keyboardType={"numeric"}
              editable={true}
              value={weight}
              onEndEditing={weight => SetWeightValue(weight)}
              returnKeyType="done"/>
        </View>

        <TouchableOpacity activeOpacity={0.5}
                          onPress={() => navigation.navigate('CreateOrSignIn' as never) }>
          <Image
              source={require('./../../assets/images/forwardarrow.png')}
              style={{width:50, height:50}}
          />
        </TouchableOpacity>

      </View>

  );
}

export default BasicInformationCollection

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
  const styles = StyleSheet.create({
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
      paddingBottom: height/4,
      paddingTop: 150,
    },
    dropdown:{
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
    },
  });
  return styles;
}


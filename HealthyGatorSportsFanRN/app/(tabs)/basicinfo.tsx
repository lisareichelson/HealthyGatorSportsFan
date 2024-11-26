import {StyleSheet, View, Text, Image, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import {useNavigation, useRoute} from "@react-navigation/native";
import { Dropdown } from 'react-native-element-dropdown';
import {SetStateAction, useState, useEffect} from "react";
import User from "@/components/user";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const BasicInformationCollection = () => {
    const navigation = useNavigation();
    //Used to save user info as collected
    const route = useRoute();
    const { currentUser } = route.params as { currentUser: any };

    const styles = SetStyles();
    const [genders] = useState([
      {label: 'Male', value: 'male'},
      {label: 'Female', value: 'female'},
      {label: 'Other', value: 'other'}
    ]);
    const [heightFeet] = useState([
      {value: '0'},
      {value: '1'},
      {value: '2'},
      {value: '3'},
      {value: '4'},
      {value: '5'},
      {value: '6'},
      {value: '7'},
      {value: '8'}
    ]);
    const [heightInches] = useState([
      {value: '0'},
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
    const [weight, setWeight] = useState('');
    const [heightInch, setHeightInches] = useState('');
    const [heightFt, setHeightFeet] = useState('');
    const [gender, setGender] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthdate, setBirthdate] = useState(new Date());
    const [isVisible, setIsVisible] = useState(false);
    //This is the displayed string representing the birthdate.
    const [birthDayStr, setBirthDayStr] = useState("Enter birthdate");

    const handleDate = (selectedDate: SetStateAction<Date>) => {
         setBirthdate(selectedDate);
         setIsVisible(false);
         //Parse the string to display in MM/DD/YY format
         setBirthDayStr(selectedDate.toLocaleString().split(',')[0]);
     };

  return (

    <ScrollView>

      <View style={styles.container}>
        <Text style={{fontSize: 25, fontFamily: 'System', textAlign: "center", justifyContent: "center", paddingTop: 100}}>Before we begin, we need some basic information.</Text>
        <Image style=
                   {{width: 150,
                    height: 150,}}
               source={require('./../../assets/images/clipboardgator.jpg')}/>

        <View style={styles.InputBoxes}>
            <Text style={{fontSize: 15, fontFamily: 'System'}}>Enter your name:</Text>
            <View style = {styles.row}>
            <TextInput
                style = {[styles.input, {marginTop:15}, {width: '45%'}]}
                placeholder="First Name"
                value={firstName}
                onChangeText={first => setFirstName(first)}
            />
            <TextInput
                style = {[styles.input, {marginTop:15}, {width: '45%'} ]}
                placeholder="Last Name"
                value={lastName}
                onChangeText={last => setLastName(last)}
            />
            </View>

            <TouchableOpacity style = {[styles.input, {marginTop:10} ]} activeOpacity={0.5}
                              onPress={() => setIsVisible(true) }>
                <Text style={{fontSize: 15, fontFamily: 'System'}}>{birthDayStr}</Text>
            <DateTimePickerModal style = {[styles.input]}
                isVisible={isVisible}
                mode="date"
                date={birthdate}
                onConfirm={handleDate}
                onChange={item => {setBirthdate(item)}}
                onCancel={() => setIsVisible(false)}
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
            />
            </TouchableOpacity>
          <Text style={{fontSize: 15, fontFamily: 'System', marginTop: 10}}>Select your gender:</Text>
          <Dropdown style={[styles.dropdown]}
                    data={genders} 
                    labelField={"label"} 
                    valueField={"value"} 
                    accessibilityLabel="Dropdown menu for selecting gender"
                    onChange={item => {setGender(item.value);}}
          ></Dropdown>

          <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Enter your height:</Text>
            <View style = {styles.row}>
                <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Feet:</Text>
                <Dropdown style={[styles.dropdown, {width: '30%'}]}
                          data={heightFeet}
                          labelField={"value"}
                          valueField={"value"}
                          accessibilityLabel="Dropdown menu for selecting height in feet"
                          onChange={item => { setHeightFeet(item.value);}}
                          renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
                ></Dropdown>

                <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Inches:</Text>
                <Dropdown style={[styles.dropdown, {width: '30%'}]}
                          data={heightInches}
                          labelField={"value"}
                          valueField={"value"}
                          accessibilityLabel="Dropdown menu for selecting additional height in inches"
                          onChange={item => {setHeightInches(item.value);}}
                          renderItem={(item) => ( <Text>{item.value.toString()}</Text> )}
                ></Dropdown>
            </View>

          <Text style={{fontSize: 15, fontFamily: 'System', paddingTop: 10}}>Enter your weight in pounds:</Text>
          <TextInput
              style={styles.input}
              placeholder="Enter a weight..."
              keyboardType={"numeric"}
              editable={true}
              value={weight}
              defaultValue={weight}
              onChangeText={newWeight => setWeight(newWeight)}
              returnKeyType="done"/>
        </View>

        <TouchableOpacity activeOpacity={0.5}
          onPress={() => SaveAndContinue(navigation, currentUser, Number(weight), gender, Number(heightInch), Number(heightFt), firstName, lastName, birthdate) }>
          <Image
              source={require('./../../assets/images/forwardarrow.png')}
              style={{width:50, height:50}}
          />
        </TouchableOpacity>
      </View>

      </ScrollView>

  );
}

export default BasicInformationCollection

function SaveAndContinue(navigation: any, currentUser: any, weight: number, gender: string, heightInches: number, heightFeet: number, firstName: string, lastName: string, birthdate: Date){
    
    //Save the variables in the user object type
    // const currentUser: User = { ...userData };
    currentUser.gender = gender;
    currentUser.heightFeet = heightFeet;
    currentUser.heightInches = heightInches;
    currentUser.firstName = firstName;
    currentUser.lastName = lastName;
    currentUser.birthDate = birthdate.toISOString().split('T')[0]; //JSON.stringify(birthdate.toISOString().split('T')[0]);
    currentUser.currentWeight = weight;

    console.log("First name: ", currentUser.firstName);
    console.log("Last name: ", currentUser.lastName);
    console.log("Birth date: ", currentUser.birthDate);
    console.log("Gender: ", currentUser.gender);
    console.log("Height in feet: ", currentUser.heightFeet);
    console.log("Height in inches: ", currentUser.heightInches);
    console.log("Weight: ", currentUser.currentWeight);

    // Continue to the next screen upon successful data submission
    navigation.navigate('GoalCollection', { currentUser } as never);

}

function SetStyles() : any{
  const styles = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    InputBoxes: {
      flex: 1,
      justifyContent: "center",
    },
    dropdown:{
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      borderColor: '#D3D3D3',
      margin: 3,
      flex: 1,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      borderColor: '#D3D3D3',
      margin: 3,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: "space-around",
    },
    button: {
      borderWidth: 1,
      marginTop: 10,
      borderRadius: 5,
      borderColor:'grey',
    }
  });
  return styles;
}
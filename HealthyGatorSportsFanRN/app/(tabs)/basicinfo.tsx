import {StyleSheet, View, Text, Image, useWindowDimensions, Platform, TouchableOpacity} from 'react-native';
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
  return (
      <View style={styles1.container}>
        <Text style={{fontSize: 30, fontFamily: 'System', bottom: height/4, alignItems: 'center', alignContent: 'center'}}>Before we begin, we need some basic information.</Text>
        <View style={styles1.TopBox}>
          <Text style={{fontSize: 20, fontFamily: 'System'}}>Select your gender:</Text>
          <Dropdown style={[styles1.dropdown]}
              data={genders} labelField={"label"} valueField={"value"} onChange={item => {
            setValue(item.value);
          }}
          ></Dropdown>
        </View>
      </View>
      
  );
}
function setValue(item: any){
  console.log(item);
}
//PLAN: create two buttons with onpress functions. Only allow one button to be selected at a time.
function SetStyles(width: number, height: number) : any{
  const styles1 = StyleSheet.create({
    container: {
      flex:1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    TopBox: {
      position: 'absolute',
      bottom: height/1.65,
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

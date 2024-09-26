import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, View, Text, Image, useWindowDimensions, Platform, TouchableOpacity} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import SelectDropdown from 'react-native-select-dropdown';
//import DropDownPicker from 'react-native-dropdown-picker';
import { Dropdown } from 'react-native-element-dropdown';


export default function BasicInformationCollection() {
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const styles1 = SetStyles(width, height);
  const genders = ["Male", "Female", "NonBinary", "Other"];
  return (
      <View style={styles1.container}>
        <Text style={{fontSize: 30, fontFamily: 'System', bottom: height/4}}>Before we begin, we need some basic information.</Text>
        <View style={styles1.rightBox}>
          <Text style={styles1.label}>Select your gender:</Text>
          <Dropdown data={genders} labelField={5} onChange={item => {
            setValue(item.valueOf);
          }}
                    valueField={5}></Dropdown>
        </View>
      </View>
      
  );
}
function setValue(item: any){

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
    rightBox: {
      position: 'absolute',
      bottom: height/3,
      left: width/9,
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

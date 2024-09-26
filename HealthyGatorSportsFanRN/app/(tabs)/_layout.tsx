import { Tabs } from 'expo-router';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import HomeScreen from './index'
import BasicInformationCollection from './explore'


const Stack = createNativeStackNavigator();


export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
      <NavigationContainer independent={true}>
          <Stack.Navigator>
              <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{headerShown: false}}
              />
              <Stack.Screen
                  name="BasicInfo"
                  component={BasicInformationCollection}
                  options={{headerShown: false}}
              />
          </Stack.Navigator>
      </NavigationContainer>
   /* <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,

        <Stack.Screen name="Profile" component={ProfileScreen} />
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
          ),
        }}
      />
    </Tabs>*/
  );
}

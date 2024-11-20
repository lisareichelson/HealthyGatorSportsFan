import {useNavigation} from "@react-navigation/native";
import { useState, useEffect, useRef } from 'react';
import {StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Platform} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

// Determine the environment
const RUN_ENV = process.env.RUN_ENV || 'local'; // Default to 'local' if RUN_ENV is not set

// Set the base URL dynamically
let pollCFBDUrl: string;
if (RUN_ENV === 'heroku') {
    pollCFBDUrl = 'https://healthygatorsportsfan-84ee3c84673f.herokuapp.com/poll-cfbd/';
} else {
    pollCFBDUrl = 'https://sawfish-premium-unlikely.ngrok-free.app/poll-cfbd/';
}

export default function NotificationsPage() {
    const navigation = useNavigation();
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(
        undefined
    );
    const notificationListener = useRef<Notifications.Subscription>();
    const responseListener = useRef<Notifications.Subscription>();

    useEffect(() => {
        registerForPushNotificationsAsync()
            .then(token => setExpoPushToken(token ?? ''))
            .catch((error: any) => setExpoPushToken(`${error}`));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            notificationListener.current &&
            Notifications.removeNotificationSubscription(notificationListener.current);
            responseListener.current &&
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    const handlePollCFBD = async () => {
        try {
            const response = await fetch(pollCFBDUrl, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: 'Poll request sent' }),
          });
          const data = await response.json();
          console.log(data);
        } catch (error) {
          console.error('Error sending poll request:', error);
        }
      };

    return (
        <View style={styles.container}>
            <Text style={{fontSize: 25, fontFamily: 'System', paddingTop: 100}}>
                Welcome to the notification management page! Press the button to send a notification.
            </Text>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
                {/* <Text>Your Expo push token: {expoPushToken}</Text> */}
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>Title: {notification && notification.request.content.title} </Text>
                    <Text style={{fontSize: 20, fontFamily: 'System'}}>Body: {notification && notification.request.content.body}</Text>
                    {/* <Text style={{fontSize: 15, fontFamily: 'System'}}>Data: {notification && JSON.stringify(notification.request.content.data)}</Text> */}
                </View>
                <Button
                    title="Press to Send Notification"
                    onPress={async () => {
                        await sendPushNotification(expoPushToken);
                    }}
                />
                <Button 
                    title="Get next game info"
                    onPress={handlePollCFBD}
                />
            </View>

            {/* <TouchableOpacity style={styles.pollButton} onPress={handlePollCFBD}>
                <Text style={styles.pollButtonText}>Get next game info</Text>
            </TouchableOpacity> */}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    pollButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 20,
      },
    pollButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});


// Notification functions

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function sendPushNotification(expoPushToken: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Test Notification',
        body: 'Hello, you got a notification!',
        // data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
    });
}

function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            handleRegistrationError('Permission not granted to get push token for push notification!');
            return;
        }
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
        console.log("projectID: " + projectId);
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
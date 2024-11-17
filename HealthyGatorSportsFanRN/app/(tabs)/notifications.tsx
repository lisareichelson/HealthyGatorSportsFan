import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Platform, FlatList, ScrollView, Alert} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import NotificationData from "@/components/notificationdata";

const NotificationsPage = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { currentUser } = route.params as { currentUser: any };

    const [newTitle, setNewTitle] = useState('');
    const [newMessage, setNewMessage] = useState('');
    

    const [notificationDatas, setNotificationDatas] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
  
    const loadNotifications = async () => {
      setLoading(true);
      try {
        const data = await fetchNotifications(currentUser.userId);
        setNotificationDatas(data);
      } catch (error) {
        // Handle error (e.g., show an alert)
      } finally {
        setLoading(false);
      }
    };

    const notificationList = notificationDatas.map(singleNotification => {
        return new NotificationData(singleNotification.notification_id, singleNotification.user, singleNotification.notification_title, singleNotification.notification_message, singleNotification.timestamp, singleNotification.read_status);
    });
    // TO DELETE: This was used for print debugging:
    /*
    notificationList.forEach((obj, index) => {
        console.log(`Notification ${index + 1} from list:`, obj);
    });
    */

    const handleCreateNotificationPress = () => {
        createNotification(expoPushToken, currentUser.userId, newTitle, newMessage);
        loadNotifications();
      };
  
    useEffect(() => {
      loadNotifications();
    }, []);

    // The below code is for sending a notification from frontend
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
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

    // The below code is for sending a notification from backend
    const handlePollCFBD = async () => {
        try {
            const response = await fetch('https://normal-elegant-corgi.ngrok-free.app/poll-cfbd/', {
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

            <Text style={styles.title}>Notifications</Text>

            <View style={styles.shadowContainer}>
                <ScrollView>
                    {notificationList.map((obj, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardTitle}>{`Title: ${obj.notification_title}`}</Text>
                            <Text style={styles.cardText}>{`Message: ${obj.notification_message}`}</Text>
                            <Text style={styles.cardText}>{`Timestamp: ${obj.timestamp}`}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonForContainer}>
                    <Text style={styles.buttonForContainerText}>Mark all as read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonForContainer}>
                    <Text style={styles.buttonForContainerText}>Clear all</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.separator}>
                <View style={styles.content}>
                    <Text>--------------------------------------------------------------------------------------</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <TextInput
                    style={styles.editBox}
                    placeholder="Title"
                    editable={true}
                    value={newTitle}
                    defaultValue={"TEST TITLE"}
                    onChangeText={newTitle => setNewTitle(newTitle)}
                />
                <TextInput
                    style={styles.editBox}
                    placeholder="Message"
                    editable={true}
                    value={newMessage}
                    defaultValue={"TEST MESSAGE"}
                    onChangeText={newMessage => setNewMessage(newMessage)}
                />
            </View>
            
            <TouchableOpacity style={styles.button} onPress={handleCreateNotificationPress}>
                <Text style={styles.buttonText}>Create notification</Text>
            </TouchableOpacity>

            <Text style={{ fontSize: 15 }}>The buttons below are for notification testing purposes only.</Text>
            
            <View style={styles.buttonContainer}>

                <TouchableOpacity style={styles.buttonForContainer} onPress={handlePollCFBD}>
                    <Text style={styles.buttonForContainerText}>Get next game info</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.buttonForContainer} onPress={async () => {{ await sendPushNotification(expoPushToken, "Test Notification", "Hello, you got a notification!"); }}}>
                    <Text style={styles.buttonForContainerText}>Press to Send Notification</Text>
                </TouchableOpacity>
                
            </View>           

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontFamily: 'System' }}>Title: {notification && notification.request.content.title} </Text>
                <Text style={{ fontSize: 15, fontFamily: 'System' }}>Body: {notification && notification.request.content.body}</Text>
            </View>

        </View>  
    );
}

export default NotificationsPage;

const styles = StyleSheet.create({
    container: {
        gap: 10,
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    shadowContainer: {
        width: '90%', // Adjust as needed
        height: '50%', // Adjust as needed        
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
        marginBottom: 20,
      },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Adjusts spacing between buttons
        width: '90%', // Adjust as needed
    },
    buttonForContainer: {
        flex: 1, // Makes buttons take equal space
        marginHorizontal: 5, // Adds space between buttons
        backgroundColor: '#2196F3', // Default button color
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 4,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        justifyContent: 'center', // Centers content vertically
      },
      buttonForContainerText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2196F3', // Default button color
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
        elevation: 2, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    editBox:{
        flex: 1,
        borderWidth: 1,
        marginRight: '5%',
        margin: 5,
    },
    card: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // For Android shadow
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardText: {
        fontSize: 16,
        marginTop: 5,
    },
    separator: {
        height: 1, // Height of the line
        backgroundColor: '#CCCCCC', // Color of the line
        marginVertical: 10, // Space around the line
      },
      content: {
        marginTop: 70, // Adjust to avoid overlap with the title
        padding: 20,
      },
});

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function sendPushNotification(expoPushToken: string, title: string, body: string) {
    const message = {
        to: expoPushToken,
        sound: 'default',
        title: title,
        body: body,
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

function createNotification(expoPushToken: string, userID: number, title: string, message: string){
    // Notification Data POST API call
    const handleCreateNotification = async () => {
        try {
            const response = await fetch('https://normal-elegant-corgi.ngrok-free.app/notificationdata/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    user: userID,
                    notification_title: title,
                    notification_message: message,
                    read_status: false
                 }),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Notification created!', [{ text: 'OK' }]);
                console.log('Notification data saved successfully:', data);
                //return response.json();
            } else {
                Alert.alert('Error', data.detail || 'Something went wrong', [{ text: 'OK' }]);
            }
        } catch (error) {
            Alert.alert('Error', 'Network error', [{ text: 'OK' }]);
        }
    };
    handleCreateNotification();
    sendPushNotification(expoPushToken, title, message);
}

export const fetchNotifications = async (userId: number) => {
    try {
      const response = await fetch(`https://normal-elegant-corgi.ngrok-free.app/notifications/${userId}/`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error; // Rethrow the error for handling in the component
    }
  };

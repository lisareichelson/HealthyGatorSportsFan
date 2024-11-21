import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, Button, Platform, FlatList, ScrollView, Alert} from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import NotificationData from "@/components/notificationdata";
import Config from 'react-native-config';

// DEBUG
console.log(Config.LOCAL_BACKEND_URL);


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
            Alert.alert('Error');
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };
      
    useEffect(() => {
        loadNotifications();
    }, []);


    // Function to handle creating a notification
  const handleCreateNotificationPress = async () => {
    try {
      await createNotification(expoPushToken, currentUser.userId, newTitle, newMessage);
      await sendPushNotification(expoPushToken, newTitle, newMessage);
      await loadNotifications(); // Refresh the notifications after creation
    } catch (error) {
      Alert.alert('Error', 'Failed to create notification');
    }
  };

  // Function to handle deleting a notification
  const handleDeleteNotificationPress = async (notification_id: number) => {
    try {
      await deleteNotification(notification_id);
      await loadNotifications(); // Refresh the notifications after deletion
    } catch (error) {
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

    // Function to handle deleting a notification
    const handleDeleteAllNotificationPress = async (userId: number) => {
        try {
            console.log("userID for deleteAll notifications: ", userId);
            await deleteAllNotifications(userId);
            await loadNotifications(); // Refresh the notifications after deletion
        } catch (error) {
          Alert.alert('Error', 'Failed to delete notifications');
        }
    };

    // const handleCreateNotificationPress = () => {
    //     createNotification(expoPushToken, currentUser.userId, newTitle, newMessage);
    //     loadNotifications();
    //     handleRefresh();
    // };

    // const handleDeleteNotificationPress = (notification_id: number) => {
    //     deleteNotification(notification_id);
    //     loadNotifications();
    //     handleRefresh();
    // };

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

            let pollUrl = '';

            if (process.env.RUN_ENV === 'development') {
                pollUrl = `${Config.LOCAL_BACKEND_URL}/poll-cfbd/`; // Use local URL
            } else {
                pollUrl = `${Config.HEROKU_BACKEND_URL}/poll-cfbd/`; // Use Heroku URL
            }

          // TO DELETE (old way of doing it PR #18)
          //const response = await fetch('https://healthygatorsportsfan-84ee3c84673f.herokuapp.com/poll-cfbd/', { // for pushing to heroku
          //const response = await fetch('https://sawfish-premium-unlikely.ngrok-free.app/poll-cfbd/', { // for running locally

          const response = await fetch(pollUrl, {
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
                    {notificationDatas.map((obj, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardTitle}>{`${obj.notification_title}`}</Text>
                                <TouchableOpacity style={styles.closeButton} onPress={() => handleDeleteNotificationPress(obj.notification_id)}>
                                    <Text style={{fontWeight: 'bold', fontSize: 25}}>×</Text>
                                </TouchableOpacity>
                            </View>                            
                            <Text style={styles.cardText}>{`${obj.notification_message}`}</Text>
                            <Text style={styles.cardText}>{`Timestamp: ${obj.timestamp}`}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonForContainer}>
                    <Text style={styles.buttonForContainerText}>Mark all as read</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonForContainer} onPress={() => handleDeleteAllNotificationPress(currentUser.userId)}>
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
        marginBottom: 5,
        padding: 10,
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
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1, // Allows the title to take available space
    },
    cardText: {
        fontSize: 14,
        //marginTop: 5,
    },
    closeButton: {
        alignItems: 'flex-end'
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center', // Aligns items vertically centered
        justifyContent: 'space-between',
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
        // console.log("projectID: " + projectId);
        if (!projectId) {
            handleRegistrationError('Project ID not found');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                    projectId,
                })
            ).data;
            //console.log(pushTokenString);
            return pushTokenString;
        } catch (e: unknown) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}

// Notification Data POST API call
const createNotification = async (expoPushToken: string, userID: number, title: string, message: string) => {
    try {
        const response = await fetch('https://normal-elegant-corgi.ngrok-free.app/notificationdata/add/', {
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
        } else {
            Alert.alert('Error', data.detail || 'Something went wrong', [{ text: 'OK' }]);
        }
    } catch (error) {
        Alert.alert('Error', 'Network error', [{ text: 'OK' }]);
    }
};

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

export const deleteNotification = async (notification_id: number) => {
    try {
        const response = await fetch(`https://normal-elegant-corgi.ngrok-free.app/notifications/${notification_id}/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            Alert.alert('Success', 'Notification deleted!', [{ text: 'OK' }]);
            console.log('Notification deleted successfully');
        } else {
            throw new Error('Failed to delete notification');
        }
    } catch (error) {
        Alert.alert('Error');
        console.error('Error deleting notification:', error);
    }
};

export const deleteAllNotifications = async (userId: number) => {
    // try {
    //     const response = await fetch(`https://normal-elegant-corgi.ngrok-free.app/notifications/deleteAll/${userId}/`, {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //     });
    //     if (!response.ok) {
    //         const errorData = await response.json();
    //         throw new Error(errorData.error || 'An error occurred');
    //     }
    //     const data = await response.json();
    //     Alert.alert('Success', data.message);
    // } catch (error) {
    //     Alert.alert('Error');
    //     console.error('Error deleting notifications:', error);
    // }


    try {
        const response = await fetch(`https://normal-elegant-corgi.ngrok-free.app/notifications/deleteAll/${userId}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.status === 204) {
            console.log('Deleted successfully');
        } else {
            console.error('Failed to delete:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
};

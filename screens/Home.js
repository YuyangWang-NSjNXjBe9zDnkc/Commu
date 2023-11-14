import { StyleSheet, Text, View,Button } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import IonIcons from '@expo/vector-icons/Ionicons'

import{ useNavigation} from '@react-navigation/native'

import { AuthContext } from '../contexts/AuthContext';
import { useContext, useState, useEffect } from 'react';
//import screens

import { Feed } from '../screens/Feed';
import { NewPost } from '../screens/NewPost';
import { Profile } from '../screens/Profile';

const Tab = createBottomTabNavigator()

export function Home(props) {

    const [email, setEmail] = useState()

    const Auth = useContext(AuthContext)

    const navigation = useNavigation()

    useEffect( () => {
        if(Auth.currentUser){
            setEmail(Auth.currentUser.email)
            //console.log(email)
            //console.log(Auth.currentUser)
            //console.log(Auth.currentUser.email)    
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'Sign in' }] })

        }
    })

    const FeedOptions = {
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => <IonIcons name="home" color={color} size={22} />,
        title: "Home",
        
    }

    // const NewPostOptions = {
    //     tabBarLabel: "New Post",
    //     tabBarIcon: ({ color }) => <IonIcons name="post-add" color={color} size={22} />,
    //     title: 'New Post',
    // }

    const ProfileOptions = {
        tabBarLabel: "Profile",
        tabBarIcon: ({ color }) => <IonIcons name="person" color={color} size={22} />,
        title: 'Welcome, ' + email,
    }
    return (
        <Tab.Navigator initialRouteName='Feed'>
            <Tab.Screen name='Feed' component={Feed} options={FeedOptions} />
            {/* <Tab.Screen name='New Post' component={NewPost} options={NewPostOptions} /> */}
            <Tab.Screen name='Profile' component={Profile} options={ProfileOptions} />
        </Tab.Navigator>
    );
}

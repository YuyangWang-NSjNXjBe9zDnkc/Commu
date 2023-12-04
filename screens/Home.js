import React from 'react';
import { StyleSheet, Text, View, Button, TextInput } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useNavigation } from '@react-navigation/native'

import { AuthContext } from '../contexts/AuthContext';
import { DbContext } from '../contexts/DbContext';
import { useContext, useState, useEffect } from 'react';


import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

//import screens

import IonIcons from '@expo/vector-icons/Ionicons'

import { Feed } from '../screens/Feed';
import { Profile } from '../screens/Profile';

const Tab = createBottomTabNavigator()

export function Home(props) {

    const [email, setEmail] = useState()

    const Auth = useContext(AuthContext)

    const db = useContext(DbContext)

    const navigation = useNavigation()

    const [post, setPost] = useState('')

    useEffect(() => {
        if (Auth.currentUser) {
            setEmail(Auth.currentUser.email)
            //console.log(email)
            //console.log(Auth.currentUser)
            //console.log(Auth.currentUser.email)    
        } else {
            navigation.reset({ index: 0, routes: [{ name: 'Sign in' }] })

        }
    })



    function NewPostScreen(props) {

        return (
            <View style={{ flex: 1, justifyContent: 'top', alignItems: 'center' }}>
                <Text>NewPost!</Text>
                
                <TextInput
                    //style={styles.textField}
                    value={post}
                    autoCapitalize="none"
                    onChangeText={(val) => setPost(val)}
                />
                <Button
                    title="Submit"
                    onPress={() => { createPost() }}
                />
            </View>
        );
    }

    const createPost = async () => {
        if (post.length < 1) { return }
        // create a timestamp
        const ts = new Date().getTime()
        // creating object to add to firestore
        const item = { postBody: post, userID: Auth.currentUser.uid, timePosted: ts }
        const colRef = collection(db, `Post`)
        await addDoc(colRef, item)
    }



    const FeedOptions = {
        tabBarLabel: "Home",
        tabBarIcon: ({ color }) => <IonIcons name="home" color={color} size={22} />,
        title: "Home",

    }

    const NewPostOptions = {
        tabBarLabel: "NewPost",
        tabBarIcon: ({ color }) => <IonIcons name="add-outline" color={color} size={22} />,
        title: 'New Post',
    }

    const ProfileOptions = {
        tabBarLabel: "Profile",
        tabBarIcon: ({ color }) => <IonIcons name="person" color={color} size={22} />,
        title: 'Welcome, ' + email,
    }

    return (
        <Tab.Navigator initialRouteName='Feed'>
            <Tab.Screen name='Feed' component={Feed} options={FeedOptions} />
            <Tab.Screen name='New Post' component={NewPostScreen} options={NewPostOptions} />
            <Tab.Screen name='Profile' component={Profile} options={ProfileOptions} />
        </Tab.Navigator>
    );
}

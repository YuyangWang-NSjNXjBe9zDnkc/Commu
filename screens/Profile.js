import { StyleSheet, Text, View, Button } from 'react-native';

import { useContext, useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../contexts/AuthContext';



export function Profile(props) {
    const [user, setUser] = useState()

    const Auth = useContext(AuthContext)

    

    useEffect( () => {
        if(Auth.currentUser){
            setUser(Auth.currentUser)                    
        }
    }, [Auth])

    //conditional rendering
    if(!user){
        return(
            <View>
                <Text>User Loading...</Text>
            </View>
        )
    } else {
        return (
            <View>
                <Text>User Email: </Text>
                <Text>{user.email}</Text>
                <Button
                title="Sign out"
                onPress={() => {
                    signOut(Auth).then(
                        //signed out, relocate to sign in
                    )
                }}
                />
            </View>
        )
    }

    
}
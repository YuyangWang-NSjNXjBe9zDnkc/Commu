import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { useState, useEffect, useContext } from 'react';

import { AuthContext } from '../contexts/AuthContext';
//react nav
import { useNavigation } from '@react-navigation/native';



export function Signin(props) {
    //use stack nav
    const navigation = useNavigation();

    const Auth = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [validEmail, setValidEmail] = useState(false)
    const [validPassword, setValidPassword] = useState(false)

    useEffect(() => {
        if (email) {
            if (email.indexOf('@') > 1) {
                setValidEmail(true)
            }
            else {
                setValidPassword(false)
            }
        }
    }, [email])

    useEffect(() => {
        if (password) {
            if (password.length >= 8) {
                setValidPassword(true)
            }
            else {
                setValidPassword(false)
            }
        }
    }, [password])
    // useEffect(() => { console.log(email) }, [email])

    useEffect(() => {
        if (Auth.currentUser) {
            navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
    })

    const submitHandler = () => {
        //console.log('submitting')

        props.handler(email, password)
            .then((user) => {

                //Sign up successful
                //console.log(user)
            })
            .catch(() => {
                //error
                console.log(err)
            })
    }

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <Text >Email</Text>

                <TextInput
                    style={styles.textField}
                    value={email}
                    autoCapitalize="none"
                    onChangeText={(val) => setEmail(val)}
                />

                <Text>Password</Text>

                <TextInput
                    style={styles.textField}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                />

                <Button
                    style={(validEmail && validPassword) ? styles.button : styles.disabledButton}
                    title="Login with account"
                    onPress={() => submitHandler()}
                    disabled={(validEmail && validPassword) ? false : true}
                />

            </View>

            <View style={styles.bottomContainer}>
                <Button

                    title="Register new account"
                    onPress={() => navigation.navigate("Sign up")}
                />

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgoundColor: "white",
        alignItems: 'center',
        justifyContent: 'Start',
    },
    form: {
        marginHorizontal: 10,
        backgroundColor: 'cccccc',
        width: '80%'
    },

    text: {
        marginTop: 5,
        backgroundColor: '#aaaaaa'
    },

    textField: {
        marginTop: 5,
        backgroundColor: 'white'
    },

    button: {
        marginTop: 5,
    },

    disabledButton: {
        marginTop: 5,
        color: 'grey',
    },

    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 10,
    }

})
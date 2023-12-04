import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';

import { useContext, useState, useEffect } from 'react';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';

import { DbContext } from '../contexts/DbContext';
import { AuthContext } from '../contexts/AuthContext';
import { collection, getDocs, query, onSnapshot, QuerySnapshot, orderBy, where } from 'firebase/firestore';


export function Profile(props) {

    const db = useContext(DbContext)

    const Auth = useContext(AuthContext)

    const [user, setUser] = useState()

    const [data1, setData1] = useState([])

    //const [password, setPassword] = useState([])

    const getData = async () => {
        if (!user) {
            return
        }
        const col = collection(db, `Post`)

        const snapshot = await getDocs(col)

        let dataList = []
        setData1(dataList)
    }

    const getRealTimeData = () => {
        if (!user) {
            return
        }

        const col = query(collection(db, `Post`), orderBy("timePosted", "desc")
            //where("userID", "==", "${Auth.currentUser.uid}"),
        )

        const unsub = onSnapshot(col, (snapshot) => {
            let dataList = []
            snapshot.forEach((item) => {
                let obj = item.data()
                obj.id = item.id
                dataList.push(obj)
            })
            setData1(dataList)
            //console.log(dataList)
        })

    }

    useEffect(() => {
        if (Auth.currentUser) {
            setUser(Auth.currentUser)
            getData()
            getRealTimeData()
        }
        else {
            setUser(null)
        }
    }, [user])



    const renderItem = ({ item }) => {
        return (
            <ListItem item={item} />
        )
    }

    function unixConversion(timestamp) {
        var dateTime = new Date(timestamp);
        return dateTime.toISOString();
    }



    const forgotPassword = (Email) => {
        console.log("reset email sent to " + Email);
        sendPasswordResetEmail(Auth, "wyywangyy96@gmail.com", null)
            .then(() => {
                alert("reset email sent to " + Email);
            })
            .catch(function (e) {
                console.log(e);
            });
    };

    //conditional rendering
    if (!user) {
        return (
            <View>
                <Text>User Loading...</Text>
            </View>
        )
    } else {
        return (
            <View>
                <Text>User Email: </Text>
                <Text>{Auth.currentUser.uid}</Text>
                <Text>{user.email}</Text>
                <Button
                    title={'ChangePassword'} onPress={() => forgotPassword(Auth.currentUser.Email)}
                />
                <Button
                    title="Sign out"
                    onPress={() => {signOut(Auth).then()}}
                            //signed out, relocate to sign in
                            //state changed, auto relocated to sign in

                        
                    
                />


                <Text>Your post:</Text>
                <FlatList
                    data={data1}
                    renderItem={({ item }) => <Text>{item.postBody}{" - Posted"}{unixConversion(item.timePosted)}</Text>}
                />

            </View>
        )
    }
}
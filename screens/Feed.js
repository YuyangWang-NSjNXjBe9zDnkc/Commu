import { StyleSheet, Text, View, FlatList, Pressable, Modal, TouchableOpacity, Alert } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { DbContext } from '../contexts/DbContext';
import { AuthContext } from '../contexts/AuthContext';
//import { ListItem } from '../components/ListItem'
//mport { ListHeader } from '../components/ListHeader'

//get db documents
import { collection, getDocs, query, onSnapshot, QuerySnapshot, orderBy, where, doc, deleteDoc } from 'firebase/firestore';

export function Feed(props) {
    const db = useContext(DbContext)

    const Auth = useContext(AuthContext)

    const [data, setData] = useState([])

    const [user, setUser] = useState()

    //const [docId, setDocId] = useState()

    const getData = async () => {
        if (!user) {
            return
        }
        //, orderBy("timePosted", "desc")
        const col = collection(db, `Post`)

        const snapshot = await getDocs(col)

        let dataList = []
        setData(dataList)
        //console.log(dataList)
    }

    const getRealTimeData = () => {
        if (!user) {
            return
        }
        // const postRef = db.collection('Post')

        // const orderByTimeRef = postRef.orderBy('timestamp', 'desc').get()

        const col = query(collection(db, `Post`), orderBy("timePosted", "desc"))

        const unsub = onSnapshot(col, (snapshot) => {
            let dataList = []
            snapshot.forEach((item) => {
                let obj = item.data()
                obj.id = item.id
                dataList.push(obj)
                //console.log(obj.id)
            })
            setData(dataList)
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

    const deleteListItem = async (documentID) => {
        console.log("deleting...")
        //create a reference to the document inside "/things/USERID/list"
        const docRef = doc(db, `Post`, documentID)
        await deleteDoc(docRef)
    }

    const handlePress = (id, docUserID) => {
        if (docUserID == Auth.currentUser.uid) {
            deleteListItem(id)
            Alert.alert("Deleted post id: ", id)
        }
        else {
            Alert.alert("You can't delete other people's post")
        }


        

    }

    return (
        <View>


            <FlatList
                data={data}
                renderItem={({ item }) =>
                    <TouchableOpacity onPress={() => {
                        //setDocId(item.id)
                        handlePress(item.id, item.userID)

                    }}>
                        <Text>{item.postBody}{" - Posted"}{unixConversion(item.timePosted)}</Text>
                    </TouchableOpacity>
                }
            />




        </View>
    )
}
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useContext, useState, useEffect } from 'react';
import { DbContext } from '../contexts/DbContext';
import { AuthContext } from '../contexts/AuthContext';
//import { ListItem } from '../components/ListItem'
//mport { ListHeader } from '../components/ListHeader'

//get db documents
import { collection, getDocs, query, onSnapshot, QuerySnapshot } from 'firebase/firestore';






export function Feed(props) {
    const db = useContext(DbContext)
    const Auth = useContext(AuthContext)

    const [data, setData] = useState([])

    const [user, setUser] = useState()

    const getData = async () => {
        if (!user) {
            return
        }
        const col = collection(db, `Post`)
        const snapshot = await getDocs(col)

        let dataList = []
        setData(dataList)
        console.log(dataList)
    }

    const getRealTimeData = () => {
        if (!user) {
            return
        }
        const col = query(collection(db, `Post`))
        const unsub = onSnapshot(col, (snapshot) => {
            let dataList = []
            snapshot.forEach((item) => {
                let obj = item.data()
                obj.id = item.id
                dataList.push(obj)
            })
            setData(dataList)
            console.log(dataList)
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



    return (
        <View>

            <FlatList
                data={data}
                renderItem={({ item }) => <Text>{item.postBody}</Text>}
            />

        </View>
    )
}
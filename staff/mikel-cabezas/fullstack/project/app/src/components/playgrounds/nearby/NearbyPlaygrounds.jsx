import { useEffect, useState, useContext } from "react"
import retrievePlaygrounds from "../../../logic/playgrounds/retrievePlaygrounds"
import NearbyPlayground from "./NearbyPlayground"
import { View, Alert } from "react-native"
import { ScrollView } from 'react-native-gesture-handler';

import retrieveUser from "../../../logic/users/retrieveUser"
import Context from '../../../AppContext.js'

export default function NearbyPlaygrounds({ onMarkerPressedHandler }) {
    const { location, TOKEN } = useContext(Context)

    const [playgrounds, setPlaygrounds] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        try {
            retrievePlaygrounds(TOKEN, location)
                .then(playgrounds => {
                    setPlaygrounds(playgrounds)
                })
                .catch(error => {
                    Alert.alert('Error', `${error.message}`, [
                        { text: 'OK', onPress: () => { } },
                    ]);
                })
            retrieveUser(TOKEN)
                .then(user => setUser(user))
                .catch(error => {
                    Alert.alert('Error', `${error.message}`, [
                        { text: 'OK', onPress: () => { } },
                    ]);
                })
        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
        }
    }, [])

    return <>
        <View className=" flex-row relative" >
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pr-5">
                {playgrounds && playgrounds[0].map(playground => {
                    return <View key={playground._id} className="w-[36vw] mr-3 last:mr-12 relative h-full" ><NearbyPlayground
                        key={playground._id}
                        playground={playground}
                        user={user}
                        onMarkerPressedHandler={onMarkerPressedHandler}
                    />
                    </View>
                })}
            </ScrollView>
        </View>
    </>

}
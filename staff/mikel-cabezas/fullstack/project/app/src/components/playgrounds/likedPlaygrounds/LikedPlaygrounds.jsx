import { useEffect, useState, useContext } from "react"
import retrieveLikedPlaygrounds from "../../../logic/playgrounds/retrieveLikedPlaygrounds"
import LikedPlayground from "./LikedPlayground"
import { View, ScrollView, Alert, Text } from "react-native"
import retrieveUser from "../../../logic/users/retrieveUser"
import AppContext from "../../../AppContext.js";
const { Provider } = AppContext
import Context from '../../../AppContext'

export default function LikedPlaygrounds({ onMarkerPressedHandler }) {
    const { TOKEN } = useContext(Context)

    const [playgrounds, setPlaygrounds] = useState()
    const [user, setUser] = useState()

    useEffect(() => {
        try {
            retrieveLikedPlaygrounds(TOKEN)
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
        <View className="flex-row relative" >

            {playgrounds?.length === 0 && <View className="flex-1 justify-center items-center h-full mt-auto pr-4 pb-4">
                <Text className="dark:text-zinc-200 text-lg text-center">You haven't saved any playground as a favorite yet!</Text>
            </View>
            }
            {playgrounds?.length > 0 &&
                <ScrollView className="pr-5 flex-1 h-full " styles={{ alignItems: 'center', justifyContent: 'center' }}>
                    {playgrounds.map(playground => {
                        return <View className="relative mb-3" >
                            <LikedPlayground
                                index={playground._id}
                                playground={playground}
                                user={user}
                                onMarkerPressedHandler={onMarkerPressedHandler}
                            />
                        </View>
                    })}
                </ScrollView>
            }

        </View>
    </>

}
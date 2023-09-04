import { useEffect } from "react";
import { Alert } from "react-native";
export default function UserValitionSuccess({ navigation }) {
    useEffect(() => {
        Alert.alert('Success', `User validated`, [
            { text: 'OK', onPress: () => { } },
        ]);
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        })
    }, []);
}
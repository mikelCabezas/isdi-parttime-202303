import React, { useEffect, useContext } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

import Context from '../../AppContext.js'
import * as Animatable from 'react-native-animatable';


import retrievePlaygroundsFromCity from "../../logic/playgrounds/retrievePlaygroundsFromCity.js";


export default function SearchResults({ handleCloseModal, data, handleViewPlaygroundsFromCity, setPlaygroundsCount }) {
    const { TOKEN } = useContext(Context)

    useEffect(() => {
    }, [data]);

    const simpleSearchRegion = (search) => {
        handleCloseModal()
        retrievePlaygroundsFromCity(TOKEN, search)
            .then(playgroundsResult => {
                handleViewPlaygroundsFromCity(playgroundsResult)
                setPlaygroundsCount(playgroundsResult[1][0].length)
            })
    }

    return <View className="dark:bg-zinc-800">
        {data.length > 0 && data.map((result, index) => {
            return <>
                <View className="pt-3 border-mainGray dark:bg-zinc-800" key={index} >
                    <View className="pt-3 border-mainGray" key={`${index}-0`} />
                    <TouchableOpacity activeOpacity={0.7} key={`${index}-touchable`} className="py-3 px-4" onPress={() => simpleSearchRegion(result)}>
                        <Text className="dark:text-zinc-200" key={`${index}-text`}> {result}</Text>
                    </TouchableOpacity>
                </View>
            </>
        })}
    </View>
}
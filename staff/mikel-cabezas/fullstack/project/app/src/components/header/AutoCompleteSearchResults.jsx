import React, { useEffect, useState, useContext } from "react";
import { Keyboard, View, Image, TextInput, TouchableOpacity, Text } from 'react-native';

import Context from '../../AppContext.js'
import * as Animatable from 'react-native-animatable';
import {
    MENU, FILTER,
    WHITE_MENU, WHITE_MY_LOCATION
} from '../../../assets/icons/index.js';

import retrievePlaygroundsFromCity from "../../logic/playgrounds/retrievePlaygroundsFromCity.js";


export default function SearchResults({ handleCloseModal, retrievedCitiesList, handleViewPlaygroundsFromCity, setPlaygroundsCount }) {

    if (colorScheme === 'dark') isDark = true
    let isDark
    let searchTimeOut

    const { modal, setModal, colorScheme, TOKEN } = useContext(Context)
    const [animation, setAnimation] = useState('fadeInDown')

    useEffect(() => {
    }, [retrievedCitiesList]);

    const onSearchPlayground = () => {

    }

    const simpleSearchRegion = (search) => {
        handleCloseModal()
        // console.log(search)
        retrievePlaygroundsFromCity(TOKEN, search)
            .then(playgroundsResult => {
                handleViewPlaygroundsFromCity(playgroundsResult)
                setPlaygroundsCount(playgroundsResult[1][0].length)
            })
    }

    return <View className="bg-mainGray w-full py-1 absolute top-0 -mtx-[65px] rounded-[22px] ">
        <View className="bg-yellow-500 w-full my-5 " />
        {retrievedCitiesList?.length > 0 && retrievedCitiesList?.map((result, index) => {
            return <View className="pt-3  border-[#d2d2d2] border-t" key={index} >
                <TouchableOpacity activeOpacity={0.7} key={`${index}-touchable`} className="pt-1 pb-3 px-4" onPress={() => simpleSearchRegion(result)}>
                    <Text key={`${index}-text`}> {result}</Text>
                </TouchableOpacity>
            </View>
        })}

    </View>
}



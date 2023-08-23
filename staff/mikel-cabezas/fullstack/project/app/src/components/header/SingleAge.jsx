import React, { useState } from "react";
import { Text, View, TouchableOpacity } from 'react-native';

export default function SingleAge({ index, age, activeAges, onAgePressed }) {
    let bgColor
    const active = activeAges?.includes(age)
    active ? bgColor = 'bg-mainLime' : bgColor = 'bg-mainGray'

    return <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        className={`border border-mainLime ${bgColor}  rounded-full mb-1 mt-2 mr-2`}
        onPress={() => onAgePressed(age)}>
        <View className="font-bold px-3 py-0.5 flex-row items-center" key={index}>
            <Text className={`font-bold text-center text-sm`}>+{age}</Text>
        </View>
    </TouchableOpacity>
}
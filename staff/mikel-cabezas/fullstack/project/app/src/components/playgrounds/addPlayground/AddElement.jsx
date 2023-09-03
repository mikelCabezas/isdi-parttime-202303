import React, { useState, useContext } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Picker } from 'react-native-wheel-pick';
import { DROPDOWN } from "../../../../assets/icons";
import Context from '../../../AppContext'

export default function AddElement({ onElementCreated, onCancelAddElement, id }) {
    let isDark
    const { colorScheme } = useContext(Context)
    if (colorScheme === 'dark') isDark = true

    const [modal, setModal] = useState()
    const [selectedType, setSelectedType] = useState();
    const [selectedAge, setSelectedAge] = useState();
    const [selectedStatus, setSelectedStatus] = useState();
    const [selectedAccessibility, setSelectedAccessibility] = useState();



    const handleAdd = () => {
        try {
            if (!selectedType || !selectedAge || !selectedStatus || !selectedAccessibility || selectedType === 'Set element' || selectedAge === 'Set age' || selectedStatus === 'Set status' || selectedAccessibility === 'Set accessibility') {
                throw new Error('Complete all fields')
            }
            const accessibility = selectedAccessibility === 'Yes' ? true : false
            const element = { _ID_: id, type: selectedType, age: Number(selectedAge), status: selectedStatus, accessibility: accessibility }
            onElementCreated(element)

        } catch (error) {
            Alert.alert('Error', `${error.message}`, [
                { text: 'OK', onPress: () => { } },
            ]);
            console.log(error.message)
        }
    }
    const handleCancel = () => {
        onCancelAddElement()

    }

    const onElementType = () => {
        setModal('type')
    }
    const onElementAge = () => {
        setModal('age')
    }
    const onElementStatus = () => {
        setModal('status')
    }
    const onElementAccessibility = () => {
        setModal('accessibility')
    }
    const onCloseModal = () => {
        setModal()

    }

    return <>
        {modal && <View className="flex-1  bg-black60 items-center justify-center absolute w-[100vw] h-full z-[51] bottom-0 ">
            <View className="w-full absolute bottom-[152px] right-0 z-50 flex-row  justify-end py-5 px-5">
                <TouchableOpacity activeOpacity={0.8} className=" rounded-lg bg-mainLime ">
                    <Text className=" p-1.5 font-bold" onPress={onCloseModal}>OK</Text>
                </TouchableOpacity>
            </View>
            {modal === 'type' && <Picker
                className="w-full bg-white dark:bg-zinc-800 h-56 text-bold rounded-[20px] absolute bottom-0 pb-[20px]"
                textColor={`${isDark ? '#fff' : '#000'}`}
                selectedValue='Set element'
                pickerData={['Set element', 'Slide', 'Swing', 'Double Swing', 'Seesaw', 'Rider', 'Sandbox', 'House', 'Climber']}
                onValueChange={label => { setSelectedType(label) }}
            />}
            {modal === 'age' && <Picker
                className="w-full bg-white dark:bg-zinc-800 h-56 text-bold rounded-[20px] absolute bottom-0 pb-[20px]"
                textColor={`${isDark ? '#fff' : '#000'}`}
                selectedValue='Set age'
                pickerData={['Set age', '+1', '+2', '+3', '+4', '+5', '+6']}
                onValueChange={label => { setSelectedAge(label) }}
            />}
            {modal === 'status' && <Picker
                className="w-full bg-white dark:bg-zinc-800 h-56 text-bold rounded-[20px] absolute bottom-0 pb-[20px]"
                textColor={`${isDark ? '#fff' : '#000'}`}
                pickerData={['Set status', 'Good', 'Acceptable', 'Warn', 'Dangerous']}
                onValueChange={label => { setSelectedStatus(label) }}
            />
            }
            {modal === 'accessibility' && <Picker
                className="w-full bg-white dark:bg-zinc-800 h-56 text-bold rounded-[20px] absolute bottom-0 pb-[20px]"
                textColor={`${isDark ? '#fff' : '#000'}`}
                selectedValue={label => { setSelectedAccessibility(label) }}
                pickerData={['Set accessibility', 'Yes', 'No']}
                onValueChange={label => {
                    if (label === 'Yes') setSelectedAccessibility(label)
                    if (label === 'No') setSelectedAccessibility(label)
                }} />}
        </View>}
        <View className="flex-1 bg-black60  items-center justify-center z-50 absolute w-full h-full">
            <View className="bg-white dark:bg-zinc-800 h-auto px-6 py-7 w-11/12 rounded-3xl">
                <Text className="dark:text-zinc-200 text-xl font-semibold">Add element</Text>
                <TouchableOpacity activeOpacity={0.8} onPress={onElementType}>
                    <Text className="dark:text-zinc-200 pt-4 text-xs ">Type</Text>
                    <View className="dark:text-zinc-200 border border-mainGray bg-mainGray 600 dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-4 py-2 self-center w-full flex-row justify-between items-center" >
                        <Text className="flex-1 dark:text-zinc-300" >{selectedType ? selectedType : 'Add element'}</Text>
                        <Image className="w-5 h-5 flex-2" source={DROPDOWN} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={onElementAge}>
                    <Text className="dark:text-zinc-200 pt-4 text-xs ">Age</Text>
                    <View className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-4 py-2 self-center w-full flex-row justify-between items-center" >
                        <Text className="flex-1 dark:text-zinc-300" >{selectedAge ? selectedAge : 'Set age'}</Text>
                        <Image className="w-5 h-5 flex-2" source={DROPDOWN} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={onElementStatus}>
                    <Text className="dark:text-zinc-200 pt-4 text-xs ">Status</Text>
                    <View className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-4 py-2 self-center w-full flex-row justify-between items-center" >
                        <Text className="flex-1 dark:text-zinc-300" >{selectedStatus ? selectedStatus : 'Set status'}</Text>
                        <Image className="w-5 h-5 flex-2" source={DROPDOWN} />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={onElementAccessibility}>
                    <Text className="dark:text-zinc-200 pt-4 text-xs ">Accessibility</Text>
                    <View className="dark:text-zinc-200 border border-mainGray bg-mainGray dark:border-zinc-700 dark:bg-zinc-700 rounded-full mt-1 mb-0 px-4 py-2 self-center w-full flex-row justify-between items-center" >
                        <Text className="flex-1 dark:text-zinc-300" >{selectedAccessibility ? selectedAccessibility : 'Set accessibility'}</Text>
                        <Image className="w-5 h-5 flex-2" source={DROPDOWN} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.8}
                    className="border border-mainLime bg-mainLime rounded-full mt-4 self-center w-full  "
                    onPress={handleAdd} >
                    <View className="font-bold px-6 py-2 self-center rounded-full" >
                        <Text className="font-bold text-lg">Add</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    className="mt-4 self-center w-full"
                    onPress={handleCancel}
                >
                    <View className="px-6  self-center " >
                        <Text className="dark:text-zinc-200 text-lg">Cancel</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </>
}
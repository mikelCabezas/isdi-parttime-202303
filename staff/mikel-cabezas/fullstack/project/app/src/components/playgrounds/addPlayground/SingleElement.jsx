import { Text, Image, View, TouchableOpacity } from 'react-native';

import {
    SLIDE, SWING, DOUBLE_SWING, SEESAW, RIDER, SANDBOX, HOUSE, CLIMBER,
    ONE_YEAR, TWO_YEAR, THREE_YEAR, FOUR_YEAR, FIVE_YEAR, SIX_YEAR,
    ACCESSIBLE
} from '../../../../assets/icons';

export default function CreatePlayground({ key, element, handleEditElement }) {
    const assignElementAge = (age) => {
        let AGE

        if (age === 1) { AGE = ONE_YEAR }
        if (age === 2) { AGE = TWO_YEAR }
        if (age === 3) { AGE = THREE_YEAR }
        if (age === 4) { AGE = FOUR_YEAR }
        if (age === 5) { AGE = FIVE_YEAR }
        if (age === 6) { AGE = SIX_YEAR }
        return AGE
    }

    const assignElementType = (type) => {
        let TYPE

        if (type === 'Slide') { TYPE = SLIDE }
        if (type === 'Swing') { TYPE = SWING }
        if (type === 'Double Swing') { TYPE = DOUBLE_SWING }
        if (type === 'Seesaw') { TYPE = SEESAW }
        if (type === 'Rider') { TYPE = RIDER }
        if (type === 'Sandbox') { TYPE = SANDBOX }
        if (type === 'House') { TYPE = HOUSE }
        if (type === 'Climber') { TYPE = CLIMBER }
        return TYPE
    }

    const assignElementStatus = (status) => {
        let STATUS

        if (status === 'Good') { STATUS = 'mainLime' }
        if (status === 'Acceptable') { STATUS = 'mainYellow' }
        if (status === 'Warn') { STATUS = '[#F18638]' }
        if (status === 'Dangerous') { STATUS = 'darkGreen' }

        return STATUS
    }

    const age = assignElementAge(element.age)
    const type = assignElementType(element.type)
    const status = assignElementStatus(element.status)

    return <TouchableOpacity
        key={key}
        activeOpacity={0.8}
        className={`border border-${status}  rounded-full mb-1 mt-2 mr-2 bg-mainGray `}
        onPress={() => handleEditElement(element.id)}>
        <View className="font-bold px-3 py-0.5 flex-row items-center" key={key}>
            <Image className="w-5 h-5 mr-2 object-contain" source={type} />
            <Text className={`font-bold text-center text-sm`}>{element.type}</Text>
            {element.accessibility === true && <View className=" flex justify-center justify-items-center p- ml-2">
                <Image className="h-6 w-6 object-cover" source={ACCESSIBLE} />
            </View>}
            <View className="rounded-xl bg-mainLime flex justify-center justify-items-center p-1 ml-2">
                <Image className="h-6 w-6 object-cover" source={age} />
            </View>
        </View>
    </TouchableOpacity>
}
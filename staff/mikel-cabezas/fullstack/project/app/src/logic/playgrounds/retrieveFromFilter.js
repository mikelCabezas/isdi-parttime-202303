// import { validators } from "../../../com";
// const { validateToken } = validators
import { EXPO_PUBLIC_API_URL } from '@env'

export default (token, query) => {
    // validateToken(token);
    // alert(EXPO_PUBLIC_API_URL)

    let age, elements, isAccessible, distance, sunExpositionFilter
    const sunExposition = []
    query.sunExposition.map(value => {
        if (value.shady?.status) sunExposition.push('shady')
        if (value.sunny?.status) sunExposition.push('sunny')
        if (value.partial?.status) sunExposition.push('partial')
    })
    const queryElements = []
    query.elements.map(value => {
        if (value.status === true) {
            queryElements.push(value.type)
        }
    })
    age = `age=${query.age}`
    elements = `&elements=${queryElements}`
    isAccessible = `&accessible=${query.isAccessible}`
    distance = `&distance=${query.distance}`
    sunExpositionFilter = `&sunExposition=${sunExposition}`

    const searchQuery = (age + elements + isAccessible + distance + sunExpositionFilter).toString()

    console.log(`process.env.EXPO_PUBLIC_API_URL/playgrounds/filter/searchQuery ${process.env.EXPO_PUBLIC_API_URL}/playgrounds/filter?${searchQuery}`)

    return fetch(`${process.env.EXPO_PUBLIC_API_URL}/playgrounds/filter/${searchQuery}`, {
        // return fetch(`${process.env.EXPO_PUBLIC_API_URL}/playgrounds/filter/age=1&elements=2`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
            if (res.status !== 200)
                return res.json().then(({ error: message }) => { throw new Error(message) })
            return res.json()
        })
}

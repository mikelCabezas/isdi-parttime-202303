// import { validators } from "../../../com";
// const { validateToken } = validators
import { EXPO_PUBLIC_API_URL } from '@env'

export default (token, query) => {
    try {
        // validateToken(token);
        // alert(EXPO_PUBLIC_API_URL)
        let age, elements, isAccessible, distance, sunExpositionFilter, from
        let sunExposition = []
        query.sunExposition.map(value => {
            value.shady?.status ? sunExposition.push('shady') : ''
            value.sunny?.status ? sunExposition.push('sunny') : ''
            value.partial?.status ? sunExposition.push('partial') : ''
        })

        let queryElements = []
        query.elements.map(value => {
            if (value.status === true) {
                queryElements.push(value.type)
            }
        })
        if (query.age?.length === 0) query.age = null
        if (queryElements.length === 0) queryElements = null
        if (sunExposition.length === 0) sunExposition = null
        // console.log(query.userCoordinates)

        if (query.userCoordinates) from = `&from=${query.userCoordinates.latitude},${query.userCoordinates.longitude}`.toString()
        if (query.citySearch) from = `&from=${query.citySearch}`

        age = `&age=${query.age}`
        elements = `&elements=${queryElements}`
        isAccessible = `&accessible=${query.isAccessible}`
        distance = `&distance=${query.distance}`
        sunExpositionFilter = `sunExposition=${sunExposition}`

        const searchQuery = (sunExpositionFilter + age + elements + isAccessible + from + distance).toString()

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
    } catch (error) {
        console.log(error.message)
    }
}
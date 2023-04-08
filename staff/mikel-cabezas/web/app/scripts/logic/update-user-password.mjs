import { context, toggleOffClassInSection } from "../ui.mjs"
import { findUserById } from "./helpers/data-managers.mjs"
import { validateNewPassword } from '../validators.mjs'
import { userAccount } from "../pages/user-account.mjs"

export function updateUserPassword(currentId) {
    // var userID = users.map(user => user.id).indexOf(currentId)
    const userId = context.userId
    const user = findUserById(userId)

    const currentPassword = userAccount.querySelector('form.user-password input.current-password')
    const newPassword = userAccount.querySelector('form.user-password input.new-password')
    const repeatPassword = userAccount.querySelector('form.user-password input.repeat-password')
    // console.log(currentId)
    validateNewPassword(currentPassword.value, newPassword.value, repeatPassword.value, user)

    user.password = newPassword.value
    currentPassword.disabled = true
    newPassword.disabled = true
    repeatPassword.disabled = true
    userAccount.querySelector('.update-password form').reset()
    toggleOffClassInSection(userAccount.querySelector('form.data.user-password .buttons'))
    userAccount.querySelector('p.message').classList.remove('error')
    userAccount.querySelector('p.message').classList.add('success')
    return userAccount.querySelector('p.message').innerHTML = 'Password changed!'
}
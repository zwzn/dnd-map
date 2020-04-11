import { v4 as uuidv4 } from 'uuid'

let cachedUser: string | null = null

export function getUser(): string {
    if (cachedUser === null) {
        cachedUser = localStorage.getItem('user')
        console.log(cachedUser);

        if (cachedUser === null) {
            cachedUser = uuidv4()
            localStorage.setItem('user', cachedUser)
        }
    }
    return cachedUser
}
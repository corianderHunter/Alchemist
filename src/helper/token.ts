

const AUTH_BEAR = 'Bearer '
const TOKEN_KEY = 'TOKEN'

export let token = localStorage.getItem(TOKEN_KEY)

export const storageToken = (value: string) => {
    token = AUTH_BEAR + value
    localStorage.setItem(TOKEN_KEY, token)
}

export const clearToken = () => {
    token = ''
    localStorage.removeItem(TOKEN_KEY)
}
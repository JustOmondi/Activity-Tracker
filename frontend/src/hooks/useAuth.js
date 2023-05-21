import { BASE_API_URL, REFRESH_TOKEN } from '../Config'
import { HTTP_200_OK, HTTP_403_FORBIDDEN, INCORRECT_CREDENTIALS, NETWORK_OR_SERVER_ERROR, OTHER_ERROR, SUCCESS, deleteCookie, getCookieValue, setCookie } from '../utils'


const useAuth = () => {

    const tokenFound = getCookieValue(REFRESH_TOKEN) ? true : false

    const redirectToLoginPage = () => {
        deleteCookie(REFRESH_TOKEN)

        window.location.replace('/');
    }

    const getAccessToken = async () => {
        const refreshToken = getCookieValue(REFRESH_TOKEN)

        if (!refreshToken) {
            window.location.replace('/');
            return
        }

        const URL = `${BASE_API_URL}/token/refresh`

        try {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({ 'refresh': refreshToken }),
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status === HTTP_200_OK) {
                const data = await response.json();

                return data['access']
            } else {
                redirectToLoginPage()
            }

        } catch (error) {
            redirectToLoginPage()
        }
    }

    const getNewTokens = async (username, password) => {
        const URL = `${BASE_API_URL}/token`

        try {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify({ 'username': username, 'pasword': password }),
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status === HTTP_200_OK) {
                const data = await response.json();

                setCookie(REFRESH_TOKEN, data['refresh'])

                return { 'message': SUCCESS }

            } else if (response.status === HTTP_403_FORBIDDEN) {
                return { 'message': INCORRECT_CREDENTIALS }

            } else {
                return { 'message': OTHER_ERROR }
            }
        } catch (error) {
            return { 'message': NETWORK_OR_SERVER_ERROR }
        }
    }

    const fetchWithAuthHeader = (url) => {

        const accessToken = getAccessToken()

        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Authentication': `Bearer ${accessToken}` }
        })
    }

    return { fetchWithAuthHeader, getAccessToken, getNewTokens, tokenFound }
}

export default useAuth
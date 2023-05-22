import { BASE_API_URL, HTTP_200_OK, HTTP_401_UNAUTHORIZED, HTTP_403_FORBIDDEN, INCORRECT_CREDENTIALS, NETWORK_OR_SERVER_ERROR, OTHER_ERROR, REFRESH_TOKEN, SUCCESS } from '../Config'
import { deleteCookie, getCookieValue, setCookie } from '../utils'


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

    const getNewTokens = async (credentials) => {
        const URL = `${BASE_API_URL}/token`

        try {
            const response = await fetch(URL, {
                method: 'POST',
                body: JSON.stringify(credentials),
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            })

            if (response.status === HTTP_200_OK) {
                const data = await response.json();

                setCookie(REFRESH_TOKEN, data['refresh'])

                return SUCCESS

            } else if (`${HTTP_403_FORBIDDEN} ${HTTP_401_UNAUTHORIZED}`.includes(response.status)) {
                return INCORRECT_CREDENTIALS

            } else {
                return OTHER_ERROR
            }
        } catch {
            return NETWORK_OR_SERVER_ERROR
        }
    }

    const fetchWithAuthHeader = async (url) => {

        const accessToken = await getAccessToken()

        return fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` }
        })
    }

    return { fetchWithAuthHeader, getAccessToken, getNewTokens, tokenFound }
}

export default useAuth
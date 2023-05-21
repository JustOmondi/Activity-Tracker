import { COOKIE_MAX_AGE_DAYS } from "./Config";

// General
export const INCORRECT_CREDENTIALS = 'Incorrect Credentials'
export const NETWORK_OR_SERVER_ERROR = 'Network or server error'
export const OTHER_ERROR = 'Other error'
export const SUCCESS = 'Success'

// HTTP Responses
export const HTTP_200_OK = 200
export const HTTP_400_BAD_REQUEST = 400
export const HTTP_404_NOT_FOUND = 404
export const HTTP_403_FORBIDDEN = 403

export const capitalize = (word) => {
    const lower = word.toLowerCase();
    return word.charAt(0).toUpperCase() + lower.slice(1);
}

// Cookies
export const getCookieValue = (cookieName) => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(cookieName + '=')) {
            return cookie.substring(cookieName.length + 1);
        }
    }

    return null;
}

export const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const setCookie = (cookieName, value) => {
    const date = new Date();
    date.setTime(date.getTime() + (COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000));

    const expires = `expires=${date.toUTCString()}`;
    const cookieValue = `${value}; ${expires} ;path=/;`

    document.cookie = `${cookieName}=${cookieValue}`;
}


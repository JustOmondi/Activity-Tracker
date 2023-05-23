import { COOKIE_MAX_AGE_DAYS } from "./Config";

export const capitalize = (word) => {
    const lower = word.toLowerCase();
    return `${word.charAt(0).toUpperCase()}${lower.slice(1)}`;
}

// DOM Cookies
export const getCookieValue = (cookieName) => {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith(`${cookieName}=`)) {
            return cookie.substring(cookieName.length + 1);
        }
    }

    return null;
}

export const deleteCookie = (cookieName) => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const setCookie = (cookieName, value) => {
    deleteCookie(cookieName)

    const date = new Date();
    date.setTime(date.getTime() + (COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000));

    const expires = `expires=${date.toUTCString()}`;
    const cookieValue = `${value}; ${expires} ;path=/;`

    document.cookie = `${cookieName}=${cookieValue}`;
}


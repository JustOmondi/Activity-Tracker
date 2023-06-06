import { BoltIcon, BookOpenIcon, BuildingOfficeIcon, UsersIcon } from '@heroicons/react/24/outline'

// General
export const BASE_API_URL = 'https://trackerdemoapi.cloud12.co.za/api'

export const THIS_WEEK = 'this_week'
export const LAST_WEEK = 'last_week'

export const NOTIFICATION_DURATION_SECONDS = 5

// Messages
export const INCORRECT_CREDENTIALS = 'Username or password incorrect. Please try again'
export const NETWORK_OR_SERVER_ERROR = 'Network / Server error. Please check your connection and reload to try again'
export const OTHER_ERROR = 'Unexpected error ocurred. Please reload and try again'
export const SUCCESS = 'Success'

// Colors
const BLUE = 'blue'
const ORANGE = 'orange'
const GREEN = 'green'
const PINK = 'pink'
const fillColor = '#ffffff'


// HTTP Responses
export const HTTP_200_OK = 200
export const HTTP_400_BAD_REQUEST = 400
export const HTTP_404_NOT_FOUND = 404
export const HTTP_403_FORBIDDEN = 403
export const HTTP_401_UNAUTHORIZED = 401

// Reports
const LESSON = 'lesson'
const ACTIVITY = 'activity'
const WEEKLY_MEETING = 'weekly_meeting'
const HOMEWORK = 'homework'

const FEATURED_TILES = [LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING]
const FEATURED_GRAPHS = [LESSON, ACTIVITY, HOMEWORK]

export const REPORT_NAMES = [LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING]

// Cookies
export const REFRESH_TOKEN = 'refresh'
export const COOKIE_MAX_AGE_DAYS = 30

// Classes
const iconClasses = 'h-8 w-8 text-white'

export const REPORTS = {
    [`${LESSON}`]: {
        title: 'Lesson Attendance',
        color: GREEN,
        name: LESSON,
        icon: <BuildingOfficeIcon fill={fillColor} className={iconClasses} />
    },
    [`${ACTIVITY}`]: {
        title: 'Activity Attendance',
        color: BLUE,
        name: ACTIVITY,
        icon: <BoltIcon fill={fillColor} className={iconClasses} />
    },
    [`${HOMEWORK}`]: {
        title: 'Homework Done',
        color: ORANGE,
        name: HOMEWORK,
        icon: <BookOpenIcon fill={fillColor} className={iconClasses} />
    },
    [`${WEEKLY_MEETING}`]: {
        title: 'Meeting Attendance',
        color: PINK,
        name: WEEKLY_MEETING,
        icon: <UsersIcon fill={fillColor} className={iconClasses} />
    },
}

export const getFeaturedTiles = () => {
    const items = []
    for (let reportName of FEATURED_TILES) {
        const report = REPORTS[reportName]
        items.push(report)
    }
    return items
}

export const getFeaturedGraphs = () => {
    const items = []
    for (let reportName of FEATURED_GRAPHS) {
        const report = REPORTS[reportName]
        items.push(report)
    }
    return items
}

export const getAllReportItems = () => {
    const items = []
    for (let reportName in REPORTS) {
        const report = REPORTS[reportName]
        items.push(report)
    }
    return items
}


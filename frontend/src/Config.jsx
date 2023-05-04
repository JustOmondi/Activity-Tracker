import { BuildingOfficeIcon, UsersIcon, BoltIcon, BookOpenIcon } from '@heroicons/react/24/outline'

export const BASE_API_URL = 'http://127.0.0.1:8000/api'

export const BLUE = 'blue'
export const ORANGE = 'orange'
export const GREEN = 'green'
export const PINK = 'pink'

export const LESSON = 'lesson'
export const ACTIVITY = 'activity'
export const WEEKLY_MEETING = 'weekly_meeting'
export const HOMEWORK = 'homework'

export const THIS_WEEK = 'this_week'
export const LAST_WEEK = 'last_week'

export const REPORT_NAMES = [LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING]

const iconClasses = 'h-8 w-8 text-white'
const fillColor = '#ffffff'

export const REPORTS = {
    [`${LESSON}`]: {
        title: 'Lesson Attendance',
        color: 'green',
        name: LESSON,
        icon: <BuildingOfficeIcon fill={fillColor} className={iconClasses}/>
    },
    [`${ACTIVITY}`]: {
        title: 'Activity Attendance',
        color: 'blue',
        name: ACTIVITY,
        icon: <BoltIcon fill={fillColor} className={iconClasses}/>
    },
    [`${HOMEWORK}`]: {
        title: 'Homework Done',
        color: 'orange',
        name: HOMEWORK,
        icon: <BookOpenIcon fill={fillColor} className={iconClasses}/>
    },
    [`${WEEKLY_MEETING}`]: {
        title: 'Meeting Attendance',
        color: 'pink',
        name: WEEKLY_MEETING,
        icon: <UsersIcon fill={fillColor} className={iconClasses}/>
    },
}

export const FEATURED_TILES = [LESSON, ACTIVITY, HOMEWORK, WEEKLY_MEETING]
export const FEATURED_GRAPHS = [LESSON, ACTIVITY, HOMEWORK]
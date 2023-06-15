<a name="readme-top"></a>
[![Build](https://github.com/JustOmondi/Activity-Tracker/actions/workflows/build.yml/badge.svg)](https://github.com/JustOmondi/Activity-Tracker/actions/workflows/build.yml)
[![Python Tests](https://github.com/JustOmondi/Activity-Tracker/actions/workflows/python_tests.yml/badge.svg)](https://github.com/JustOmondi/Activity-Tracker/actions/workflows/python_tests.yml)
[![Python Coverage](https://codecov.io/gh/JustOmondi/Activity-Tracker/branch/main/graph/badge.svg?token=VK2YI0Q2IY)](https://codecov.io/gh/JustOmondi/Activity-Tracker)


# Activity Tracker
A simple activity tracker that can be used to track simple attendance-based / recurring tasks. It provides a dashboard for one to perform daily, weekly or fortnightly analysis of activity trends.

![Sreenshot](screenshots/dashboard.png)

<a name="demo"></a>
See [Live Demo](https://activity-tracker-demo.onrender.com/)

### Demo Account Credentials
`username: demo`

`password: demo1403!`

 <br>

## Features
<a name="features"></a>
- Manage activity updates (Add, change, remove)
- Manage members (Add, update, remove) 
- View Daily, Weekly, Fortnightly activity trends
- User authenticaion (JWT token-based)
- Responsive UI

This is a project that was created to help establish a digital, centralized activity tracking system for a community-based social development orgnisation, working with a set group of people. Hence a lot of the current functionality is structured around the needs of the organisation at the currrent stage of the project. 

For example, the main users of the system would be people that are not quite tech-savvy and would like to be able to simply login, update activity, view trends/updates and would rather have the more technical aspects such as user sign up, user password management handled from the backend. Fortunately Django provides a convenient built-in admin dashboard to allow for this.

However, further work is in progress to cater for different system user-roles where more technical users can have more features available in the front-end

## Built With
<a name="built-with"></a>
* [Django](https://www.djangoproject.com/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Docker](https://www.docker.com/)

# Getting Started


## Prerequisites
<a name="prerequisites"></a>
- Python 3.8 or higher which you can obtain [here](https://www.python.org/downloads/)
- Node.js V18 or higher which you can obtain [here](https://nodejs.dev/en/download/)

## Installation
<a name="installation"></a>
Clone the repo to where you will be running the system

### Back-end
---
1. Set the current directory in your terminal to the `backend` folder
2. Get all dependencies<br>
`python -m pip install -r requirements.txt`
3. Create the necessary migrations<br>
`python manage.py makemigrations`
4. Run the migrations<br>
`python manage.py migrate`
4. Create an admin superuser<br>
`python manage.py createsuperuser`
5. Start local web server
`python manage.py runserver`
6. View back-end admin interface by navigating to `http://127.0.0.1:8000/admin`


### Front-end
---
1. Set the current directory in your terminal to the `frontend` folder
2. Get all dependencies<br>
`npm install`
3. Start the React server<br>
`npm start`
5. View front-end by navigating to `http://127.0.0.1:3000` although it  should open automatically after running the previous step
6. Login using the username and password of the superuser that had been created

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage
<a name="usage"></a>

### Dashboard page
---
![Sreenshot](screenshots/dashboard.png)

### View specific activity trends
---
![Sreenshot](screenshots/activity-trend.png)

### Subgroups page
---
![Sreenshot](screenshots/subgroups-page.png)

### Members Page
---
![Sreenshot](screenshots/members-page.png)

### Filter Members list
---
![Sreenshot](screenshots/filter-members.png)


### Add Member
---
![Sreenshot](screenshots/add-member.png)

### Edit Member
---
![Sreenshot](screenshots/update-member.png)

### Remove Member
---
![Sreenshot](screenshots/remove-member.png)

### Update Activity
---
![Sreenshot](screenshots/update-activity.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Customization
Customization is quite limited currently (work in progress to enable color customization), one can however change the name, color assigned and icon presenting each activity by changing the associated values in the `frontend/src/Config.jsx` file. 

### Example
---
```
import { BuildingOfficeIcon } from '@heroicons/react/24/outline'
...
const LESSON = 'lesson'
...
const GREEN = 'green'
...
export const REPORTS = {
    ...
    [`${LESSON}`]: {
        title: 'Lesson Attendance',
        color: GREEN,
        name: LESSON,
        icon: <BuildingOfficeIcon fill={fillColor} className={iconClasses} />
    }
    ...
}
```

### Activity types
---
You can also add more activities in ``REPORTS {}`` in the `frontend/src/Config.jsx` file, however you would also need to add the corresponding activity report names in the backend

`backend/reports/constants.py`

```
# Report names
LESSON = 'lesson'
ACTIVITY = 'activity'
WEEKLY_MEETING = 'weekly_meeting'
HOMEWORK = 'homework'

REPORT_NAMES = [ACTIVITY, LESSON, HOMEWORK, WEEKLY_MEETING]
```
<a name="usage"></a>

# Work in progress
<a name="wip"></a>
- [ ] Add front-end user sign up and account management functionality
- [ ] Add dark mode
- [ ] Add text-based activity updates
- [ ] Add front-end Subgroup addition functionality
- [ ] Add custom theme configuration

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Contact
<a name="usage"></a>
<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Acknowledgements
<a name="acknowledgements"></a>
A list of resources I found helpful in this project that I would like to give credit to 
* [Ant Design](https://ant.design/)
* [Hero Icons](https://heroicons.com/)
* [Chart JS](https://www.chartjs.org/)
* [Django Rest Framework](https://www.django-rest-framework.org/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
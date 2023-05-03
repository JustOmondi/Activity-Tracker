import React, {useState, useEffect} from 'react'
import InfoCard from '../components/InfoCard'
import { BuildingOfficeIcon, UsersIcon, BoltIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import GraphCard from '../components/GraphCard'
import { ACTIVITY, HOMEWORK, LESSON, REPORT_NAMES, THIS_WEEK, LAST_WEEK, WEEKLY_MEETING, BASE_API_URL } from '../constants'
import { Skeleton  } from 'antd'
import RecentChanges from '../components/RecentChanges'

export default function HomePage() {
  const [reportTotalsForWeek, setReportTotalsForWeek] = useState({})
  const [reportTotalsForToday, setReportTotalsForToday] = useState({})
  const [memberChanges, setMemberChanges] = useState([])
  const [reportChanges, setReportChanges] = useState([])

  useEffect(() => {
    getReports()
    getRecentChanges()
  }, [])

  const formatReports = (data) => {
      let formattedReports = {}
      let formattedReportsForToday = {}

      REPORT_NAMES.forEach((reportName) => {
        formattedReports[reportName] = {
          'this_week': Object.values(data[THIS_WEEK][reportName]),
          'last_week': Object.values(data[LAST_WEEK][reportName])
        }

        const currentDay = (new Date()).getDay()

        formattedReportsForToday[reportName] = {
          'this_week': data[THIS_WEEK][reportName][currentDay],
          'last_week': data[THIS_WEEK][reportName][currentDay]
        }
      });
      
      setReportTotalsForWeek(formattedReports)
      
      setReportTotalsForToday(formattedReportsForToday)
  }

  const getReports = async () => {
    const URL = `${BASE_API_URL}/structure/department/reportsbyweek?dept_number=1`

    let response = await fetch(URL);
    let data = await response.json();
    formatReports(data);
  }

  const getRecentChanges = async () => {
    const URL = `${BASE_API_URL}/logs`

    let response = await fetch(URL);
    let data = await response.json();
    
    setMemberChanges(data['member_changes'])
    setReportChanges(data['report_changes'])
  }

  const getInfoCardSkeleton = () => {
    return (
      <div className='info-card shadow-lg bg-white p-3 m-1 rounded-2xl relative mb-8 2xl:mb-0'>
        <div>
          <div className='flex w-full justify-between'>
            <Skeleton.Input active />
            <div><Skeleton.Avatar shape={'square'} size={'medium'} active /></div>
          </div>
        </div>
      </div>
    )
  }

  const getGraphCardSkeleton = () => {
    return (
      <div className='info-card shadow-lg bg-white p-3 m-1 rounded-2xl relative mb-8 2xl:mb-0 overflow-hidden border-8 border-white'>
        <div>
          <div className='flex w-full justify-center mt-3 scale-[3]'>
            <Skeleton.Input  active />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='highlights flex justify-evenly flex-wrap mt-3'>
        {!reportTotalsForToday.hasOwnProperty(LESSON) && getInfoCardSkeleton()}
        {reportTotalsForToday.hasOwnProperty(LESSON) && (
          <InfoCard 
            icon={<BuildingOfficeIcon fill='#fff' className='h-8 w-8 text-white'/>}
            title={'Lesson Attendance'}
            currentValue={reportTotalsForToday[LESSON][THIS_WEEK]}
            lastweekValue={reportTotalsForToday[LESSON][LAST_WEEK]}
            color={'green'}
            link={'/reports?name=lesson'}
          />
        )}
        
        {!reportTotalsForToday.hasOwnProperty(HOMEWORK) && getInfoCardSkeleton()}
        {reportTotalsForToday.hasOwnProperty(HOMEWORK) && (
          <InfoCard 
            icon={<BookOpenIcon fill='#fff' className='h-8 w-8 text-white'/>}
            title={'Homework Done'}
            currentValue={reportTotalsForToday[HOMEWORK][THIS_WEEK]}
            lastweekValue={reportTotalsForToday[HOMEWORK][LAST_WEEK]}
            color={'orange'}
            link={'/reports?name=homework'}
          />
        )}
        
        {!reportTotalsForToday.hasOwnProperty(ACTIVITY) && getInfoCardSkeleton()}
        {reportTotalsForToday.hasOwnProperty(ACTIVITY) && (
          <InfoCard 
            icon={<BoltIcon fill='#fff' className='h-8 w-8 text-white'/>}
            title={'Activity Attendance'}
            currentValue={reportTotalsForToday[ACTIVITY][THIS_WEEK]}
            lastweekValue={reportTotalsForToday[ACTIVITY][LAST_WEEK]}
            color={'blue'}
            link={'/reports?name=activity'}
          />
        )}
        
        {!reportTotalsForToday.hasOwnProperty(WEEKLY_MEETING) && getInfoCardSkeleton()}
        {reportTotalsForToday.hasOwnProperty(WEEKLY_MEETING) && (
          <InfoCard 
            icon={<UsersIcon fill='#fff' className='h-8 w-8 text-white'/>}
            title={'Weekly Meeting'}
            currentValue={reportTotalsForToday[WEEKLY_MEETING][THIS_WEEK]}
            lastweekValue={reportTotalsForToday[WEEKLY_MEETING][LAST_WEEK]}
            loading={!reportTotalsForToday.hasOwnProperty(WEEKLY_MEETING)}
            color={'pink'}
            link={'/reports?name=weekly_meeting'}
          />
        )}
        
      </div>
      <div className='graphs flex w-full justify-evenly flex-wrap mt-14 space-around'>
        {!reportTotalsForWeek.hasOwnProperty(ACTIVITY) && getGraphCardSkeleton()}
        {reportTotalsForWeek.hasOwnProperty(ACTIVITY) && (
          <GraphCard
            color={'blue'}
            icon={<BoltIcon fill='#fff' className='h-8 w-8 text-white'/>} 
            title={'Activity Attendance'} 
            graphData={reportTotalsForWeek[ACTIVITY]}
            link={'/reports?name=activity'}
          />
        )}
        
        {!reportTotalsForWeek.hasOwnProperty(LESSON) && getGraphCardSkeleton()}
        {reportTotalsForWeek.hasOwnProperty(LESSON) && (
          <GraphCard
            color={'green'}
            icon={<BuildingOfficeIcon fill='#fff' className='h-8 w-8 text-white'/>} 
            title={'Lesson Attendance'} 
            graphData={reportTotalsForWeek[LESSON]}
            link={'/reports?name=lesson'}
          />
        )}

        {!reportTotalsForWeek.hasOwnProperty(HOMEWORK) && getGraphCardSkeleton()}
        {reportTotalsForWeek.hasOwnProperty(HOMEWORK) && (
          <GraphCard
            color={'orange'}
            icon={<BookOpenIcon fill='#fff' className='h-8 w-8 text-white'/>} 
            title={'Homework Done'} 
            graphData={reportTotalsForWeek[HOMEWORK]}
            link={'/reports?name=homework'}
          />
        )}
      </div>
      <div className='flex w-full justify-evenly space-around mt-0 xl:mt-12 flex-wrap xl:flex-nowrap'>
        <div className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {memberChanges.length === 0 && <Skeleton  active paragraph={{ rows: 2 }} />}
          {memberChanges.length !== 0 && <RecentChanges changes={memberChanges} title={'Member Chages'}/>}
        </div>
        <div className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {reportChanges.length === 0 && <Skeleton  active paragraph={{ rows: 2 }} />}
          {reportChanges.length !== 0 && <RecentChanges changes={reportChanges} title={'Report Chages'}/>}
        </div>
      </div>
    </div>
  )
}

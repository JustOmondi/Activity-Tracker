import { Skeleton } from 'antd'
import React, { useEffect, useState } from 'react'
import { BASE_API_URL, HTTP_200_OK, LAST_WEEK, REPORT_NAMES, THIS_WEEK, getFeaturedGraphs, getFeaturedTiles } from '../Config'
import RecentChangesCard from '../components/RecentChangesCard'
import ReportGraphTile from '../components/ReportGraphTile'
import ReportTile from '../components/ReportTile'
import useAuth from '../hooks/useAuth'
import useNotificationMessage from '../hooks/useNotificationMessage'

export default function Dashboard() {
  const [reportTotalsForWeek, setReportTotalsForWeek] = useState({})
  const [reportTotalsForToday, setReportTotalsForToday] = useState({})
  const [memberChanges, setMemberChanges] = useState([])
  const [reportChanges, setReportChanges] = useState([])

  const {
    contextHolder,
    showMessage
  } = useNotificationMessage()

  const { fetchWithAuthHeader } = useAuth()

  useEffect(() => {
    getDashboardData()
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
        'last_week': data[LAST_WEEK][reportName][currentDay]
      }
    });

    setReportTotalsForWeek(formattedReports)

    setReportTotalsForToday(formattedReportsForToday)
  }

  const getDashboardData = async () => {

    const URL = `${BASE_API_URL}/reports/get/department/by-week?dept_number=1`

    try {
      const response = await fetchWithAuthHeader(URL)

      if (response.status === HTTP_200_OK) {
        const data = await response.json();

        formatReports(data['reports']);

        setMemberChanges(data['logs']['member_changes'])
        setReportChanges(data['logs']['report_changes'])
      } else {
        showMessage('error', `An error ocurred in fetching members. Please try again (E:${response.status})`)
      }
    } catch (error) {
      showMessage('error', `Network / server error occurred. Please try again`)
    }
  }

  const getInfoCardSkeleton = (index) => {
    return (
      <div key={index} className='info-card shadow-lg bg-white p-3 m-1 rounded-2xl relative mb-8 2xl:mb-0'>
        <div>
          <div className='flex w-full justify-between'>
            <Skeleton.Input active />
            <div><Skeleton.Avatar shape={'square'} size={'medium'} active /></div>
          </div>
        </div>
      </div>
    )
  }

  const getGraphCardSkeleton = (index) => {
    return (
      <div key={index} className='info-card shadow-lg bg-white p-3 m-1 rounded-2xl relative mb-8 2xl:mb-0 overflow-hidden border-8 border-white'>
        <div>
          <div className='flex w-full justify-center mt-3 scale-[3]'>
            <Skeleton.Input active />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      {contextHolder}
      <div className='highlights flex justify-evenly flex-wrap mt-3'>
        {getFeaturedTiles().map((reportItem, index) => {
          return (
            <>
              {!reportTotalsForToday.hasOwnProperty(reportItem.name) && getInfoCardSkeleton(index)}
              {reportTotalsForToday.hasOwnProperty(reportItem.name) && (
                <ReportTile
                  key={index}
                  icon={reportItem.icon}
                  title={reportItem.title}
                  currentValue={reportTotalsForToday[reportItem.name][THIS_WEEK]}
                  lastweekValue={reportTotalsForToday[reportItem.name][LAST_WEEK]}
                  color={reportItem.color}
                  link={`/app/reports?name=${reportItem.name}`}
                />
              )}
            </>
          )
        })}
      </div>
      <div className='graphs flex w-full justify-evenly flex-wrap mt-14 space-around'>
        {getFeaturedGraphs().map((reportItem, index) => {
          return (
            <>
              {!reportTotalsForWeek.hasOwnProperty(reportItem.name) && getGraphCardSkeleton(index)}
              {reportTotalsForWeek.hasOwnProperty(reportItem.name) && (
                <ReportGraphTile
                  key={index}
                  color={reportItem.color}
                  icon={reportItem.icon}
                  title={reportItem.title}
                  graphData={reportTotalsForWeek[reportItem.name]}
                  link={`/app/reports?name=${reportItem.name}`}
                />
              )}
            </>
          )
        })}
      </div>
      <div className='flex w-full justify-evenly space-around mt-0 xl:mt-12 flex-wrap xl:flex-nowrap'>
        <div key={1} className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {memberChanges.length === 0 && <Skeleton key={1} active paragraph={{ rows: 2 }} />}
          {memberChanges.length !== 0 && <RecentChangesCard key={1} changes={memberChanges} title={'Member Changes'} />}
        </div>
        <div key={2} className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {reportChanges.length === 0 && <Skeleton key={2} active paragraph={{ rows: 2 }} />}
          {reportChanges.length !== 0 && <RecentChangesCard key={2} changes={reportChanges} title={'Report Changes'} />}
        </div>
      </div>
    </div>
  )
}

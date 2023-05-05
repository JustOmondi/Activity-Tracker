import React, {useState, useEffect} from 'react'
import ReportTile from '../components/ReportTile'
import ReportGraphTile from '../components/ReportGraphTile'
import { Skeleton  } from 'antd'
import RecentChangesCard from '../components/RecentChangesCard'
import { REPORT_NAMES, THIS_WEEK, LAST_WEEK, BASE_API_URL, getFeaturedTiles, getFeaturedGraphs } from '../Config'

export default function Dashboard() {
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
        {getFeaturedTiles().map((reportItem, index) => {
            return (
              <>
                {!reportTotalsForToday.hasOwnProperty(reportItem.name) && getInfoCardSkeleton()}
                {reportTotalsForToday.hasOwnProperty(reportItem.name) && (
                  <ReportTile 
                    key={index}
                    icon={reportItem.icon}
                    title={reportItem.title}
                    currentValue={reportTotalsForToday[reportItem.name][THIS_WEEK]}
                    lastweekValue={reportTotalsForToday[reportItem.name][LAST_WEEK]}
                    color={reportItem.color}
                    link={`/reports?name=${reportItem.name}`}
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
                {!reportTotalsForWeek.hasOwnProperty(reportItem.name) && getGraphCardSkeleton()}
                {reportTotalsForWeek.hasOwnProperty(reportItem.name) && (
                  <ReportGraphTile
                    key={index}
                    color={reportItem.color}
                    icon={reportItem.icon}
                    title={reportItem.title}
                    graphData={reportTotalsForWeek[reportItem.name]}
                    link={`/reports?name=${reportItem.name}`}
                  />
                )}
              </>
            )
        })}
      </div>
      <div className='flex w-full justify-evenly space-around mt-0 xl:mt-12 flex-wrap xl:flex-nowrap'>
        <div className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {memberChanges.length === 0 && <Skeleton  active paragraph={{ rows: 2 }} />}
          {memberChanges.length !== 0 && <RecentChangesCard changes={memberChanges} title={'Member Changes'}/>}
        </div>
        <div className='w-full xl:w-1/2 shadow-lg bg-white p-2 xl:p-6 m-1 rounded-2xl mx-0 xl:mx-6 mb-4 xl:mb-0'>
          {reportChanges.length === 0 && <Skeleton  active paragraph={{ rows: 2 }} />}
          {reportChanges.length !== 0 && <RecentChangesCard changes={reportChanges} title={'Report Changes'}/>}
        </div>
      </div>
    </div>
  )
}

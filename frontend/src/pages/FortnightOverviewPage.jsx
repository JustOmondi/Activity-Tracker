import React, {useState, useEffect} from 'react'
import { BASE_API_URL, REPORTS } from '../Config'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
);

export default function FortnightOverviewPage() {
  const [values, setValues] = useState([])
  const [labels, setLabels] = useState([])

  const queryParameters = new URLSearchParams(window.location.search)

  const reportName = queryParameters.get('name') ? queryParameters.get('name') : 'lesson'
  const reportConfig = REPORTS[reportName]

  useEffect(() => {
    getReports()
  }, [])

  const getReports = async () => {
    const URL = `${BASE_API_URL}/reports/get/department/by-fortnight?dept_number=1&report_name=${reportName}`

    let response = await fetch(URL);
    let data = await response.json();

    setValues(data['values']);
    setLabels(data['labels']);
  }

  const calculateAverage = () => {
    const length = values.length

    const sum = values.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

    return (sum/length).toFixed(2)
  }

  const config = {
    labels,
    datasets: [
      {
        label: 'Attendance',
        data: values,
        backgroundColor: '#ffffff',
      }],
  };

  const options = {
    responsive: true,
    barThickness: '8',
    color: '#ffffff',
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff'
        },
        grid: {
          display: false,
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
          stepSize: 2,
        },
        grid: {
          borderDash: 8,
          color: '#ffffff20',
        }
      }
    }
  };

  return (
    <div className='w-full justify-center flex'>
      <div className='w-full lg:w-3/4 shadow-lg bg-white p-4 xl:p-8 mt-4 rounded-2xl mb-14 xl:mb-10'>
        <div className='flex justify-center mt-4 flex-col'>
            <h2 className='card-title font-bold text-gray-900 mb-4 text-md xl:text-xl'>{reportConfig.title}</h2>
            <div className={`graph-container relative w-full p-3 rounded-2xl graph-bg-${reportConfig.color}`}>
              <Bar options={options} data={config} />
            </div>
        </div>
        <div className='flex justify-left mt-6'>
            <div className={`card-icon-container rounded-md items-center flex icon-bg-${reportConfig.color} p-2 mr-4`}>
              {reportConfig.icon}
            </div>
            <div>
                
                <div className='card-title font-light text-slate-500'>Range: Last 2 weeks</div>
                <div className='card-title font-light text-slate-500'>Average: {calculateAverage()}</div>
            </div>
        </div>
    </div>
    </div>
  )
}

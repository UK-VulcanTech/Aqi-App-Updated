import React from 'react';
import { pollutantsData } from '../../constants/pollutantsData';

const PollutantsCard = () => {

  const maxValue = Math.max(...pollutantsData.map(item => item.value));
  // Function to determine the fill color based on AQI value
  const getColorForAQI = aqi => {
    if (aqi <= 20)
      return {
        color: 'green',
        status: 'Good',
      };
    if (aqi <= 40)
      return {
        color: 'yellow',
        status: 'Moderate',
      };
    if (aqi <= 60)
      return {
        color: 'orange',
        status: 'Unhealthy for sensitive people',
      };
    if (aqi <= 80)
      return {
        color: 'red',
        status: 'Unhealthy',
      };
    if (aqi > 80)
      return {
        color: 'purple',
        status: 'Very unhealthy',
      };
    return {
      color: 'maroon',
      status: 'Hazardous',
    };
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(68, 68, 68, 0.3)',
        padding: '14px',
        backdropFilter: 'blur(5px)',
      }}
      className='absolute top-1/4 md:top-1/4 left-6 md:left-8 flex flex-col items-start h-auto w-70 rounded-lg z-1000'
    >
      <h1 className='text-xl drop-shadow-md text-white'>Air Quality map</h1>
      <h3 style={{ color: 'red' }} className='mb-2 text-md'>
        Lahore
      </h3>
      <div className='h-0.5 w-11/12 px-4 my-2 self-start bg-white/40' />
      <div className='text-md flex items-center justify-start gap-4 w-full text-gray-700'>
        <p
          className='px-2 py-1 mx-1 rounded-md text-2xl font-semibold'
          style={{
            color: getColorForAQI(150).color,
            padding: '4px',
          }}
        >
          {150}
        </p>
        <div
          className='px-2 py-1 rounded-lg  text-sm text-white'
          style={{
            backgroundColor: getColorForAQI(150).color,
          }}
        >
          {getColorForAQI(150).status}
        </div>
      </div>
      {/* Pollutants section */}
      <div className='w-full p-2 px-4 my-2 mt-4 rounded-xl text-sm bg-theme-black/60'>
        {pollutantsData.map((data, index) => {
          const barWidth = (data.value / maxValue) * 100;
          return (
            <div className='mb-2' key={data.pollutant}>
              <div className='flex justify-between items-center'>
                <p className='text-md text-white'>{data.pollutant}</p>
                <p className='text-md text-white'>
                  {data.value} {data.unit}
                </p>
                {/* Bar representing the range */}
                <div className='h-1.5 w-18 bg-gray-200 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-theme-green rounded-full'
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
              {index !== pollutantsData.length - 1 && (
                <div className='h-0.5 w-full px-4 my-2 self-start bg-white/20' />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollutantsCard;

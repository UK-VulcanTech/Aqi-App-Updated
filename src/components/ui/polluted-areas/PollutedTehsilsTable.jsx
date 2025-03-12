const PollutedTehsilsTable = () => {
  const tehsilData = [
    {
      id: '01',
      name: 'Shalimar',
      aqi: 178,
      status: 'Unhealthy',
      standardValue: '12x above Standard',
    },
    {
      id: '02',
      name: 'Lahore City',
      aqi: 165,
      status: 'Unhealthy',
      standardValue: '11x above Standard',
    },
    {
      id: '03',
      name: 'Model Town',
      aqi: 163,
      status: 'Unhealthy',
      standardValue: '11x above Standard',
    },
    {
      id: '04',
      name: 'Raiwind',
      aqi: 144,
      status: 'Poor',
      standardValue: '10x above Standard',
    },
    {
      id: '05',
      name: 'Lahore Cantt',
      aqi: 138,
      status: 'Poor',
      standardValue: '9x above Standard',
    },
    {
      id: '06',
      name: 'Walton Cantt Board',
      aqi: 133,
      status: 'Poor',
      standardValue: '9x above Standard',
    },
    {
      id: '07',
      name: 'Lahore Cantt Board',
      aqi: 132,
      status: 'Poor',
      standardValue: '9x above Standard',
    },
  ];

  const getStatusColor = status => {
    return status === 'Unhealthy' ? 'text-red-500' : 'text-orange-500';
  };

  const getProgressBarColor = status => {
    return status === 'Unhealthy' ? 'bg-red-500' : 'bg-orange-500';
  };

  return (
    <div className='w-full bg-theme-dark-grey'>
      <div className='max-w-8xl mx-auto py-6 px-32'>
        <div className='border-t py-4'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-5xl font-bold text-gray-800'>
              Most Polluted Tehsils in Lahore 2025
            </h1>
            <p className='text-[#7D7D7D] text-2xl font-medium'>
              • Analyze the real-time most air polluted tehsils in the city.
            </p>
          </div>

          <div className='overflow-x-auto'>
            {/* Table Header */}
            <div className='grid grid-cols-5 mb-1'>
              <div className='px-4 py-2 text-left font-medium text-gray-700'>
                Rank
              </div>
              <div className='px-4 py-2 text-left font-medium text-gray-700'>
                Tehsil
              </div>
              <div className='px-4 py-2 text-left font-medium text-gray-700'>
                AQI
              </div>
              <div className='px-4 py-2 text-left font-medium text-gray-700'>
                AQI Status
              </div>
              <div className='px-4 py-2 text-left font-medium text-gray-700'>
                Standard Value
              </div>
            </div>

            {/* Table Rows */}
            <div className='w-full space-y-1'>
              {tehsilData.map(tehsil => (
                <div
                  key={tehsil.id}
                  className='grid grid-cols-5 bg-gray-800 px-2 py-3 rounded-md'
                >
                  <div className='px-2 text-center text-gray-300'>
                    {tehsil.id}.
                  </div>
                  <div className='px-2 text-left text-white'>{tehsil.name}</div>
                  <div className='px-2'>
                    <div className='flex items-start space-x-2'>
                      <span className='text-white text-sm'>{tehsil.aqi}</span>
                      <div className='w-24 bg-gray-700 rounded-full h-2'>
                        <div
                          className={`h-2 rounded-full ${getProgressBarColor(tehsil.status)}`}
                          style={{ width: `${(tehsil.aqi / 200) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 ${getStatusColor(tehsil.status)}`}>
                    {tehsil.status}
                  </div>
                  <div className={`px-2 ${getStatusColor(tehsil.status)}`}>
                    {tehsil.standardValue}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollutedTehsilsTable;

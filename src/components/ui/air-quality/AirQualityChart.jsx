import {useState} from 'react';
import {IoLocationOutline} from 'react-icons/io5';
import {FaChevronDown} from 'react-icons/fa';
import {BarChart, Bar, XAxis, YAxis, ResponsiveContainer} from 'recharts';

const AirQualityChart = () => {
  const [selectedPollutant, setSelectedPollutant] = useState('PM 10');
  const [timeRange] = useState('7 Days');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Sample data for the chart
  const airQualityData = [
    {date: '03/04/2025', day: 'Mon', value: 145},
    {date: '04/04/2025', day: 'Tue', value: 190},
    {date: '05/04/2025', day: 'Wed', value: 203},
    {date: '06/04/2025', day: 'Thu', value: 245},
    {date: '07/04/2025', day: 'Fri', value: 165},
    {date: '08/04/2025', day: 'Sat', value: 210},
    {date: '09/04/2025', day: 'Sun', value: 200},
  ];

  // Format data for Recharts
  const chartData = airQualityData.map(item => ({
    name: `${item.date}\n${item.day}`,
    value: item.value,
    fill: item.value >= 150 ? '#f97316' : '#facc15', // orange-400 : yellow-400
  }));

  const pollutants = ['AQI', 'PM 2.5', 'PM 10', 'CO', 'SO2', 'NO2', 'O3'];

  return (
    <div className="w-full bg-theme-dark-grey">
      <div className="max-w-8xl mx-auto py-6 px-32">
        <div className="border-t py-4">
          <div className="flex justify-end items-center mt-4">
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 text-white rounded-md">
                {timeRange}
              </button>

              <div className="relative">
                <button
                  className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}>
                  {selectedPollutant} <FaChevronDown className="ml-2" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-36 bg-gray-800 text-white rounded-md shadow-lg z-10">
                    {pollutants.map(pollutant => (
                      <div
                        key={pollutant}
                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center"
                        onClick={() => {
                          setSelectedPollutant(pollutant);
                          setDropdownOpen(false);
                        }}>
                        {selectedPollutant === pollutant && (
                          <span className="text-blue-400 mr-2">▶</span>
                        )}
                        <span
                          className={
                            selectedPollutant === pollutant
                              ? 'text-blue-400'
                              : ''
                          }>
                          {pollutant}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm mt-6">
            {/* Location inside the card */}
            <div className="mb-4">
              <button className="inline-flex items-center border border-theme-border rounded-md px-4 py-2 bg-white">
                <IoLocationOutline className="text-blue-500 mr-2" size={18} />
                <span className="text-blue-500">Lahore, Punjab, PK</span>
              </button>
            </div>

            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 50,
                  }}>
                  <XAxis
                    dataKey="name"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tick={{fontSize: 12, fill: '#6b7280'}}
                  />
                  <YAxis
                    domain={[0, 300]}
                    ticks={[0, 50, 100, 150, 200, 250, 300]}
                    tick={{fontSize: 12, fill: '#6b7280'}}
                    tickFormatter={value => (value === 300 ? '300+' : value)}
                  />
                  <Bar
                    dataKey="value"
                    barSize={40}
                    fill="#f97316"
                    // Apply different fill colors based on value
                    isAnimationActive={false}
                    shape={props => {
                      const {x, y, width, height} = props;
                      return (
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill={props.payload.fill}
                          radius={[0, 0, 0, 0]}
                        />
                      );
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQualityChart;

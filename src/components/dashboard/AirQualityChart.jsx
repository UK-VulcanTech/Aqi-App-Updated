// import {useState} from 'react';
// import {IoLocationOutline} from 'react-icons/io5';
// import {FaChevronDown} from 'react-icons/fa';
// import {BarChart, Bar, XAxis, YAxis, ResponsiveContainer} from 'recharts';
// import {biIcons} from '../../../global/icons';

// const AirQualityChart = () => {
//   const [selectedPollutant, setSelectedPollutant] = useState('PM 10');
//   const [timeRange] = useState('7 Days');
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // Sample data for the chart
//   const airQualityData = [
//     {date: '03/04/2025', day: 'Mon', value: 145},
//     {date: '04/04/2025', day: 'Tue', value: 190},
//     {date: '05/04/2025', day: 'Wed', value: 203},
//     {date: '06/04/2025', day: 'Thu', value: 245},
//     {date: '07/04/2025', day: 'Fri', value: 165},
//     {date: '08/04/2025', day: 'Sat', value: 210},
//     {date: '09/04/2025', day: 'Sun', value: 200},
//   ];

//   // Format data for Recharts
//   const chartData = airQualityData.map(item => ({
//     name: `${item.date}\n${item.day}`,
//     value: item.value,
//     fill: item.value >= 150 ? '#f97316' : '#facc15', // orange-400 : yellow-400
//   }));

//   const pollutants = ['AQI', 'PM 2.5', 'PM 10', 'CO', 'SO2', 'NO2', 'O3'];

//   return (
//     <div className="w-full bg-theme-bgDashboard">
//       <div className="w-full 2xl:max-w-11/12 3xl:max-w-9/12 mx-auto px-8 md:px-12 lg:px-32">
//         <div className="border-t py-8">
//           <div className="flex flex-col gap-2">
//             <h1 className="text-2xl md:text-5xl font-bold text-gray-800">
//               Historical Air Quality Data
//             </h1>
//             <p className="text-[#7D7D7D] text-md md:text-2xl font-medium">
//               Air Quality Index in Lahore
//             </p>
//           </div>
//           <div className="flex justify-end items-center mt-4">
//             <div className="flex gap-2">
//               <button className="px-4 py-2 bg-gray-800 text-white rounded-md">
//                 {timeRange}
//               </button>

//               <div className="relative">
//                 <button
//                   className="px-4 py-2 bg-gray-800 text-white rounded-md flex items-center"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   {selectedPollutant} <FaChevronDown className="ml-2" />
//                 </button>

//                 {dropdownOpen && (
//                   <div className="absolute right-0 mt-1 w-36 bg-gray-800 text-white rounded-md shadow-lg z-10">
//                     {pollutants.map(pollutant => (
//                       <div
//                         key={pollutant}
//                         className="px-4 py-2 mx-2 border-b border-b-white/60 hover:bg-gray-700 cursor-pointer flex items-center"
//                         onClick={() => {
//                           setSelectedPollutant(pollutant);
//                           setDropdownOpen(false);
//                         }}>
//                         {selectedPollutant === pollutant && (
//                           <span className="text-blue-400 mr-2">
//                             {biIcons.BiSolidRightArrow}
//                           </span>
//                         )}
//                         <span
//                           className={
//                             selectedPollutant === pollutant
//                               ? 'text-blue-400'
//                               : 'ml-6'
//                           }>
//                           {pollutant}
//                         </span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-lg p-2 md:p-6 border border-gray-200 shadow-sm mt-6 w-full max-w-5xl 2xl:max-w-10/12 mx-auto">
//             {/* Location inside the card */}
//             <div className="mb-4">
//               <button className="inline-flex items-center border border-theme-border rounded-md px-4 py-2 bg-white">
//                 <IoLocationOutline className="text-blue-500 mr-2" size={18} />
//                 <span className="text-sm md:text-lg text-blue-500">
//                   Lahore, Punjab, PK
//                 </span>
//               </button>
//             </div>

//             <div className="h-[300px] sm:h-80 md:h-96">
//               <ResponsiveContainer width="100%" height="100%">
//                 <BarChart
//                   data={chartData}
//                   className="md:left-[20px] right-2 md:right-[30px]"
//                   margin={{
//                     top: 20,
//                     // right: 30,
//                     // left: 20,
//                     bottom: 50,
//                   }}>
//                   <XAxis
//                     dataKey="name"
//                     angle={-45}
//                     textAnchor="end"
//                     height={window.innerWidth < 640 ? 50 : 70} // Reduce height for small screens
//                     tick={{
//                       fontSize: window.innerWidth < 640 ? 10 : 12,
//                       fill: '#6b7280',
//                     }}
//                   />
//                   <YAxis
//                     domain={[0, 300]}
//                     ticks={[0, 50, 100, 150, 200, 250, 300]}
//                     tick={{fontSize: 12, fill: '#6b7280'}}
//                     tickFormatter={value => (value === 300 ? '300+' : value)}
//                   />
//                   <Bar
//                     dataKey="value"
//                     barSize={window.innerWidth < 640 ? 25 : 40}
//                     fill="#f97316"
//                     // Apply different fill colors based on value
//                     isAnimationActive={false}
//                     shape={props => {
//                       const {x, y, width, height} = props;
//                       return (
//                         <rect
//                           x={x}
//                           y={y}
//                           width={width}
//                           height={height}
//                           fill={props.payload.fill}
//                           radius={[0, 0, 0, 0]}
//                         />
//                       );
//                     }}
//                   />
//                 </BarChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AirQualityChart;

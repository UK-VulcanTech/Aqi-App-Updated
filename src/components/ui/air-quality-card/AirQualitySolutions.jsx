// import React from 'react';
import AirCard from '../../../assets/images/AirCard.png';

const AirQualitySolutions = () => {
  // Card data
  const solutionCards = [
    {
      id: 1,
      image: AirCard,
      alt: 'Business team discussing air quality solutions',
      title: 'Air Quality Solution',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
    {
      id: 2,
      image: AirCard,
      alt: 'City skyline with air quality monitoring',
      title: 'Air Quality Solution',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
    {
      id: 3,
      image: AirCard,
      alt: 'Classroom with air quality monitoring',
      title: 'Air Quality Solution',
      description:
        "A complete solution for air quality monitoring, data analysis, and fresh air solutions in workplaces prioritizing employee's health and productivity.",
    },
  ];

  return (
    <div className='bg-theme-dark-grey py-10 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='border-t border-theme-dark-grey pt-6'>
          <h2 className='text-3xl font-bold text-gray-800'>
            Air Quality Solutions For Lahore
          </h2>
          <p className='text-gray-600 mt-2'>
            • Explore the innovations of air quality monitoring & clean air.
          </p>
        </div>

        {/* Solution Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {solutionCards.map(card => (
            <div
              key={card.id}
              className='bg-white rounded-lg shadow-md overflow-hidden'
            >
              <div className='h-64 overflow-hidden'>
                <img
                  src={card.image}
                  alt={card.alt}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='p-4'>
                <h3 className='text-xl font-semibold text-gray-800'>
                  {card.title}
                </h3>
                <p className='text-gray-600 text-sm mt-2'>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AirQualitySolutions;

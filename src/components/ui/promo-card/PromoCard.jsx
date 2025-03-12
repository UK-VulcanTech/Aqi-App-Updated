import MobileApp from '../../..//assets/images/MobileApp.png';

const PromoCard = () => {
  return (
    <div className='bg-theme-dark-grey flex items-center justify-center p-4'>
      {/* White card with rounded corners */}
      <div className='max-w-6xl rounded-3xl shadow-2xl p-8 w-full h-[400px] bg-white flex flex-col md:flex-row items-center'>
        {/* Left side - Phone images */}
        <div className='w-2/3 flex justify-center'>
          <img
            src={MobileApp}
            alt='App login screen'
            className='w-[700px] h-auto'
          />
        </div>

        {/* Right side - Text and download buttons */}
        <div className='md:w-1/2 mt-8 md:mt-0 px-4 text-center md:text-left'>
          <div className='text-orange-500 text-xl font-medium'>Mobile App</div>
          <h2 className='text-4xl font-bold text-gray-800 mt-2'>
            Empower Your Decisions
          </h2>
          <h2 className='text-4xl font-bold text-gray-800 mt-1'>
            with Reliable Data
          </h2>

          {/* App Store Buttons */}
          <div className='flex flex-col sm:flex-row mt-8 gap-4 justify-center md:justify-start'>
            <a
              href='#'
              className='bg-blue-500 text-white py-3 px-5 rounded-lg flex items-center justify-center'
            >
              <svg
                className='w-8 h-8 mr-3'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M16.5,3C14.76,3 13.09,4 12,5.5C10.91,4 9.24,3 7.5,3C4.42,3 2,5.42 2,8.5C2,12.28 5.4,16.36 12,22C18.6,16.36 22,12.28 22,8.5C22,5.42 19.58,3 16.5,3' />
              </svg>
              <div>
                <div className='text-xs'>Get it on</div>
                <div className='text-xl font-semibold'>App Store</div>
              </div>
            </a>
            <a
              href='#'
              className='bg-gray-800 text-white py-3 px-5 rounded-lg flex items-center justify-center'
            >
              <svg
                className='w-8 h-8 mr-3'
                viewBox='0 0 24 24'
                fill='currentColor'
              >
                <path d='M16.5,3C14.76,3 13.09,4 12,5.5C10.91,4 9.24,3 7.5,3C4.42,3 2,5.42 2,8.5C2,12.28 5.4,16.36 12,22C18.6,16.36 22,12.28 22,8.5C22,5.42 19.58,3 16.5,3' />
              </svg>
              <div>
                <div className='text-xs'>Get it on</div>
                <div className='text-xl font-semibold'>Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCard;

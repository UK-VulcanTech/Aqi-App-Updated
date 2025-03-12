import Logo from '../../../assets/images/Logo.png';
import { faIcons, imIcons } from '../../../global/icons';
const Footer = () => {
  return (
    <div className='flex flex-col w-full mt-12'>
      <div className='flex flex-col py-4 bg-theme-black text-white'>
        {/* Logo  */}
        <img className='mx-4 ' src={Logo} height={80} width={400} />
        {/* Text Content Section */}
        <div className='m-6 flex flex-col lg:flex-row lg:items-start lg:gap-0'>
          <div className='lg:w-[30%] mr-16'>
            <h1 className='my-2 uppercase font-bold'>Our Location</h1>
            <p>
              Secretary to Government of Punjab Gate No. 8, National Hockey
              Stadium Gaddafi Stadium, Ferozepur Road, Lahore
            </p>
          </div>
          <div className='lg:w-[20%]'>
            <h1 className='my-2 font-bold'>Phone No:</h1>
            <p>+92-42-99231818</p>
            <p>+92-42-99232236</p>
          </div>
          <div className='lg:w-[20%]'>
            <h1 className='my-2 font-bold'>Email:</h1>
            <p>ddisepa@punjab.gov.pk</p>
          </div>
          <div className='lg:w-[20%]'>
            <h1 className='my-2 font-bold'>Helpline:</h1>
            <p>Helpline: 1373</p>
          </div>
          <div className='lg:w-[10%] flex gap-4'>
            <h1 className='text-3xl font-bold hover:text-theme-green'>
              {imIcons.ImFacebook2}
            </h1>
            <h1 className='text-3xl font-bold hover:text-theme-green'>
              {faIcons.FaSquareXTwitter}
            </h1>
          </div>
        </div>
      </div>
      <div className='md:flex justify-evenly py-2 px-2 bg-theme-green text-white'>
        <p className='mb-2 md:mb-0 text-sm font-semibold'>
          Environment Protection Department, Government of the Punjab
        </p>
        <p className='text-sm font-semibold'>
          <span className='font-normal'>Powered by: </span>Punjab Information
          Technology Board
        </p>
      </div>
    </div>
  );
};

export default Footer;

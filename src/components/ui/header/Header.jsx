import React, { useState } from 'react';
import Logo from '../../../assets/images/Logo.png';
import LoginBtn from '../buttons/LoginBtn';
import { aiIcons, cgIcons, tbIcons } from '../../../global/icons';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();
  const [isMenuSelected, setIsMenuSelected] = useState(false);
  return (
    <>
      {/* Header for below medium screens */}
      {!isMenuSelected && (
        <div className='block md:hidden py-2 px-2 w-full text-black'>
          <p
            onClick={() => setIsMenuSelected(true)}
            className='text-2xl cursor-pointer'
          >
            {aiIcons.AiOutlineMenu}
          </p>
        </div>
      )}
      {/* Sidebar */}
      {isMenuSelected && (
        <div className='md:hidden'>
          <div
            onClick={() => setIsMenuSelected(false)}
            className='absolute left-50 top-4 z-50 cursor-pointer'
          >
            <p className='text-xl text-black'>{cgIcons.CgCloseR}</p>
          </div>
          <div className='absolute left-0 top-0 bottom-0 w-48 p-2 z-50 bg-theme-black text-white'>
            <div className='flex flex-col'>
              <img className='my-2' src={Logo} />
              <div className='flex flex-col mt-4'>
                <a href='#' className='ml-2 p-2 hover:text-theme-green'>
                  About Us
                </a>
                <a href='#' className='ml-2 p-2 hover:text-theme-green'>
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header for Medium to large screens */}
      <div className='hidden md:flex items-center justify-between w-full h-auto py-2 pb-4 px-10 lg:px-24 z-50 text-white bg-theme-black'>
        <img onClick={() => navigate('/map')} src={Logo} />
        <div className='flex justify-between items-center gap-14'>
          <div className='flex gap-12 text-lg cursor-pointer'>
            <a
              href='#'
              className='text-sm lg:text-normal hover:text-theme-green'
            >
              About Us
            </a>
            <a
              href='#'
              className='text-sm lg:text-normal hover:text-theme-green'
            >
              Contact Us
            </a>
          </div>
          <LoginBtn title='Login' icon={tbIcons.TbArrowUpRight} />
        </div>
      </div>
    </>
  );
};

export default Header;

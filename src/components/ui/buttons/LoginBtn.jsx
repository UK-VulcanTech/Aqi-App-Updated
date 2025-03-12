// import React from "react";

const LoginBtn = ({ title, icon }) => {
  return (
    <div className='flex justify-center items-center font-semibold gap-1 px-8 py-2 rounded-lg cursor-pointer bg-theme-green hover:bg-[#12c166]'>
      {title}
      <span className='text-lg'>{icon}</span>
    </div>
  );
};

export default LoginBtn;

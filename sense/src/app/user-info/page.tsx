// src/app/user-info/page.tsx

'use client';

import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

const UserInfoPage = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const { userInfo, setUserInfo, setError } = context;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (!userInfo.name || !userInfo.age) {
      context.setError('Please provide both name and age.');
      return;
    }
    setError('');
    router.push('/diagnosis');
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold mb-8">Enter Your Information</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="border p-2 w-full my-2 rounded"
          value={userInfo.name}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          className="border p-2 w-full my-2 rounded"
          value={userInfo.age}
          onChange={handleInputChange}
        />
        {context.error && (
          <div className="mt-2 text-red-500">{context.error}</div>
        )}
        <button
          onClick={handleNext}
          className="rounded-full bg-blue-500 text-white px-6 py-2 mt-4 disabled:opacity-50 hover:bg-blue-600 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserInfoPage;
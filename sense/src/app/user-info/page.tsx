// src/app/user-info/page.tsx

'use client';

import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { useRouter } from 'next/navigation';

const questions = [
  "Little interest or pleasure in doing things.",
  "Feeling down, depressed, or hopeless.",
  "Trouble falling or staying asleep, or sleeping too much.",
  "Feeling tired or having little energy.",
  "Poor appetite or overeating.",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down.",
  "Trouble concentrating on things, such as reading the newspaper or watching television.",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual.",
  "Thoughts that you would be better off dead or of hurting yourself in some way.",
  "Feeling nervous, anxious or on edge.",
  "Not being able to stop or control worrying.",
  "Worrying too much about different things.",
  "Trouble relaxing.",
  "Being so restless that it is hard to sit still.",
  "Becoming easily annoyed or irritable.",
  "Feeling afraid as if something awful might happen."
];

const options = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day"
];

const UserInfoPage = () => {
  const context = useContext(AppContext);
  const router = useRouter();

  if (!context) {
    throw new Error('AppContext is undefined');
  }

  const { userInfo, setUserInfo, setError, psychiatricAnswers, setPsychiatricAnswers } = context;

  const [formError, setFormError] = useState<string>('');

  // Initialize psychiatricAnswers with nulls if not already initialized
  useEffect(() => {
    if (psychiatricAnswers.length < questions.length) {
      setPsychiatricAnswers(Array(questions.length).fill(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const handleAnswerClick = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...psychiatricAnswers];
    newAnswers[questionIndex] = options[optionIndex];
    setPsychiatricAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Validate user info
    if (!userInfo.name || !userInfo.age) {
      setFormError('Please provide both name and age.');
      setError('Please provide both name and age.');
      return;
    }

    // Validate psychiatric answers
    const unanswered = psychiatricAnswers.filter(answer => answer === null || answer === undefined);
    if (unanswered.length > 0) {
      setFormError('Please answer all the psychiatric evaluation questions.');
      setError('Please answer all the psychiatric evaluation questions.');
      return;
    }

    setFormError('');
    setError('');

    console.log("User Info:", userInfo);
    console.log("Psychiatric Answers:", psychiatricAnswers);

    router.push('/diagnosis'); // Redirect to the diagnosis page
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Enter Your Information</h1>
      
      {/* User Information Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="border border-gray-300 p-3 w-full my-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={userInfo.name}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            className="border border-gray-300 p-3 w-full my-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            value={userInfo.age}
            onChange={handleInputChange}
          />
          {formError && (
            <div className="mt-2 text-red-500">{formError}</div>
          )}
        </div>
      </div>

      {/* Psychiatric Evaluation Form */}
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Psychiatric Evaluation Form</h2>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex} className="mb-6">
            <h3 className="text-lg font-medium mb-2 text-gray-700">{question}</h3>
            <div className="flex flex-wrap gap-4">
              {options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => handleAnswerClick(questionIndex, optionIndex)}
                  className={`px-4 py-2 rounded ${
                    psychiatricAnswers[questionIndex] === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  } hover:bg-blue-400 hover:text-white transition-colors duration-200 flex-1 min-w-[120px]`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="w-full max-w-md text-center">
        <button
          onClick={handleSubmit}
          className="rounded-full bg-blue-500 text-white px-6 py-3 mt-4 disabled:opacity-50 hover:bg-blue-600 transition w-full text-lg font-semibold"
        >
          Submit
        </button>
      </div>

      {/* Informational Note */}
      {psychiatricAnswers.length === questions.length && psychiatricAnswers.every(answer => answer !== null && answer !== undefined) && (
        <div className="mt-8 w-full max-w-md text-gray-600 text-center">
          <p>
            After completing your diagnosis, you can access the{' '}
            <strong>Chatbot</strong> and{' '}
            <strong>Treatment Map</strong> by clicking on the respective links in the top-right navigation bar.
          </p>
        </div>
      )}
    </div>
  );
};

export default UserInfoPage;
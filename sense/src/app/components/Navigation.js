"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

const pages = [
    '/home/welcome',
    '/home/login',
    '/home/loading',
    '/home/form',
    '/home/video',
    '/home/loadingResults',
    '/home/map',
    '/home/diagnosis',
    '/home/article',
];

const Navigation = () => {
    const router = useRouter();
    const currentPageIndex = pages.indexOf(router.pathname);

    const handleNext = () => {
        if(currentPageIndex < pages.length - 1){
            router.push(pages[currentPageIndex + 1]);
        }
    };

    const handlePrevious = () => {
        if(currentPageIndex > 0){
            router.push(pages[currentPageIndex - 1]);
        }
    };

    return(
        <div>
            <button onClick={handlePrevious} disabled={currentPageIndex === 0}>
                Previous
            </button>
            <button onClick={handleNext} disabled={currentPageIndex === pages.length - 1}>
                Next
            </button>
        </div>
    );
};

export default Navigation;

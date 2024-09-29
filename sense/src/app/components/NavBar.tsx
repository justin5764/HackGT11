<<<<<<< Updated upstream
=======
"use client";

>>>>>>> Stashed changes
import React from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname

<<<<<<< Updated upstream
'use client';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const Navbar: React.FC = () => {
  const { user, isLoading } = useUser();
  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div>
        <Link href="/" className="mr-4">
          Home
        </Link>
        <Link href="/upload" className="mr-4">
          Upload Videos
        </Link>
        {user && (
          <Link href="/profile" className="mr-4">
            Profile
          </Link>
        )}
      </div>
      <div>
        {!isLoading && !user && (
          <Link href="/api/auth/login" className="mr-4">
            Login
          </Link>
        )}
        {!isLoading && user && (
          <>
            <span className="mr-4">Hello, {user.name}</span>
            <Link href="/api/auth/logout">Logout</Link>
          </>
        )}
=======
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

const NavBar = ({ showNext = false, showPrevious = false, showForm = false }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path with usePathname
  const currentPageIndex = pages.indexOf(pathname);

  const handleNext = () => {
    if (currentPageIndex < pages.length - 1) {
      router.push(pages[currentPageIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      router.push(pages[currentPageIndex - 1]);
    }
  };

  return (
    <nav style={styles.nav}>
      {/* Logo on the left side */}
      <div style={styles.logo}>
        <Image 
          src="/images/logo.png" 
          alt="Logo" 
          width={50} 
          height={50} 
          objectFit="contain" 
        />
      </div>

      {/* Navigation links in the center */}
      <div style={styles.navActions}>
        {/* Other navigation-related items can go here */}
      </div>

      {/* Buttons on the right side */}
      <div style={styles.buttonGroup}>
        {showPrevious && (
          <button
            style={styles.navButton}
            onClick={handlePrevious}
            disabled={currentPageIndex === 0}
          >
            Previous
          </button>
        )}

        {showNext && (
          <button
            style={styles.navButton}
            onClick={handleNext}
            disabled={currentPageIndex === pages.length - 1}
          >
            Next
          </button>
        )}

        {showForm && (
          <button style={styles.navButton}>Form</button>
        )}

        <button style={styles.logoutButton}>Log out</button>
>>>>>>> Stashed changes
      </div>
    </nav>
  );
};
<<<<<<< Updated upstream
export default Navbar;
=======

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to right, #00a1ff, #007ba7)', 
    padding: '10px 20px',
    height: '70px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: '100%',
  },
  navActions: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center', 
    gap: '10px',
  },
  buttonGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  navButton: {
    padding: '10px 20px',
    backgroundColor: '#007ba7', 
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#ffffff',
    transition: 'background-color 0.3s',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#000000',
    transition: 'background-color 0.3s',
  },
};

export default NavBar;
>>>>>>> Stashed changes

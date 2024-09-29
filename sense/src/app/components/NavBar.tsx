
import React from 'react';
import Image from 'next/image';
import Navigation from '../components/navigation'

interface NavBarProps {
  showNext?: boolean;      // Optional prop for showing the Next button
  showPrevious?: boolean;  // Optional prop for showing the Previous button
  showForm?: boolean;      // Optional prop for showing the Form button
}

const NavBar: React.FC<NavBarProps> = ({ showNext, showPrevious, showForm }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <img src="/images/logo.png" />
      </div>

      <div style={styles.navActions}>
        <Navigation />
        {/* Conditionally render Previous button */}
        {showPrevious && (
          <button style={styles.navButton}>Previous</button>
        )}

        {/* Conditionally render Form button */}
        {showForm && (
          <button style={styles.navButton}>Form</button>
        )}

        {/* Conditionally render Next button */}
        {showNext && (
          <button style={styles.navButton}>Next</button>
        )}
      </div>

      <button style={styles.logoutButton}>Log out</button>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(to right, #00a1ff, #007ba7)', // Blue gradient
    padding: '10px 20px',
    height: '70px',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#000',
  },
  navActions: {
    display: 'flex',
    gap: '10px',  // Adds space between buttons
  },
  navButton: {
    padding: '10px 15px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: '#f1f1f1',
    border: '1px solid #ccc',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#000000',
  },
};

export default NavBar;
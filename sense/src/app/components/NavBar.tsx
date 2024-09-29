// src/app/components/NavBar.tsx

'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';
import { usePathname } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import {
  HomeIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon, // Updated Icon
  MapIcon,
  ArrowRightOnRectangleIcon, // Updated Icon
  ArrowLeftOnRectangleIcon, // Updated Icon
  Bars3Icon, // Updated Icon
  XMarkIcon, // Updated Icon
} from '@heroicons/react/24/outline';

const NavBar = () => {
  const { user, error, isLoading } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'User Info', path: '/user-info', icon: <UserCircleIcon className="h-5 w-5 mr-1" /> },
    { name: 'Diagnosis', path: '/diagnosis', icon: <HomeIcon className="h-5 w-5 mr-1" /> },
    { name: 'Chatbot', path: '/chatbot', icon: <ChatBubbleLeftIcon className="h-5 w-5 mr-1" /> }, // Updated Icon
    { name: 'Map', path: '/map', icon: <MapIcon className="h-5 w-5 mr-1" /> },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Brand Name */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-xl text-gray-800">Sense</span>
            </Link>
          </div>

          {/* Middle: Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex md:items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side: User Actions */}
          <div className="flex items-center">
            {isLoading && <div className="text-gray-700">Loading...</div>}
            {error && <div className="text-red-500">Error: {error.message}</div>}
            {!isLoading && !user && (
              <Link
                href="/api/auth/login"
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-1" />
                Login
              </Link>
            )}
            {!isLoading && user && (
              <Menu as="div" className="relative">
                <Menu.Button className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none">
                  {/* User Avatar or Icon */}
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || 'User Avatar'} // Providing a default alt value
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 mr-2 text-gray-700" />
                  )}
                  <span className="font-medium">{user.name || 'User'}</span> {/* Providing a default name */}
                </Menu.Button>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {/* Removed Profile Menu Item */}
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          href="/api/auth/logout"
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } flex items-center px-4 py-2 text-sm text-gray-700`}
                        >
                          <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                          Logout
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            )}

            {/* Mobile Menu Button */}
            <div className="flex md:hidden ml-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                aria-expanded={isMenuOpen}
                aria-label="Toggle main menu"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.path
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-700 pt-4 pb-3">
            {!isLoading && !user && (
              <Link
                href="/api/auth/login"
                className="flex items-center px-5 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2" />
                Login
              </Link>
            )}
            {!isLoading && user && (
              <div className="px-5 py-3">
                <div className="flex items-center">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name || 'User Avatar'} // Providing a default alt value
                      className="h-10 w-10 rounded-full mr-3"
                    />
                  ) : (
                    <UserCircleIcon className="h-10 w-10 text-gray-700 mr-3" />
                  )}
                  <div>
                    <div className="text-base font-medium text-gray-800">{user.name || 'User'}</div> {/* Providing a default name */}
                    <div className="text-sm font-medium text-gray-500">{user.email || 'email@example.com'}</div> {/* Providing a default email */}
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {/* Removed Profile Menu Item */}
                  <Link
                    href="/api/auth/logout"
                    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-700 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2" />
                    Logout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
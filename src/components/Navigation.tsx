import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Menu, X, Network } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { isAdmin } = useRole();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  const navigationItems = [
    { name: 'Home', href: '/' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Sponsors', href: '/sponsors' },
    { name: 'Blog', href: '/blogs' },
    { name: 'Members', href: '/members' },
    { name: 'Join Network', href: '/join' },
  ];

  // Add admin panel link for admins
  const adminNavigationItems = isAdmin
    ? [...navigationItems, { name: 'Admin Panel', href: '/admin' }]
    : navigationItems;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Network Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <img
              src="/lovable-uploads/2e32e8e2-a824-49a8-a0dc-1066eb2e770e.png"
              alt="The Network Logo"
              className="h-10 w-10 object-contain"
              style={{
                filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))',
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {adminNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Authentication */}
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
                <button
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Admin Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-muted-foreground hover:text-primary p-2"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t border-border">
              {adminNavigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Authentication */}
              <div className="pt-4 border-t border-border">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full inline-block ml-3">
                        Admin
                      </div>
                    )}
                    <button
                      onClick={() => {
                        handleSignOut();
                        toggleMenu();
                      }}
                      className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      handleSignIn();
                      toggleMenu();
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-left"
                  >
                    Admin Sign In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
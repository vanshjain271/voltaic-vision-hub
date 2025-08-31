import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'About', href: '#about' },
    { name: 'Admin', href: '#admin' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-glass-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-xl font-bold neon-text">THE NETWORK</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="nav-link px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Admin Login Button */}
          <div className="hidden md:block">
            <Button variant="outline" size="sm" className="btn-glass">
              <User className="w-4 h-4 mr-2" />
              Admin Login
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 glass-card border-t border-glass-border">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="px-3 py-2">
              <Button variant="outline" size="sm" className="btn-glass w-full">
                <User className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
import React from 'react';
import { Settings, Key } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ThemeToggle from './ThemeToggle';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm py-4 px-6 transition-colors duration-300">
      <div className="container max-w-3xl mx-auto flex justify-between items-center">
        <div className="flex items-center pl-0">
          <Link to="/" className="hover:opacity-80 transition-opacity">
            <h1 className="header-title eizi-standout text-4xl font-extrabold tracking-tight" style={{color: '#a21caf'}}>Eizi</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4 pr-0">
          <ThemeToggle />
          <Link to="/settings">
            <Button 
              variant="ghost" 
              size="icon" 
              title="API Settings"
              className="rounded-full"
            >
              <Key className="h-5 w-5" />
              <span className="sr-only">API Settings</span>
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onOpenSettings} 
            title="User Settings"
            className="rounded-full"
          >
            <Settings className="h-5 w-5" />
            <span className="sr-only">User Settings</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

// src/components/layout/Navigation.tsx - Premium Glassmorphism Navigation
import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { 
  Home, BarChart3, TrendingUp, FileText, Coins, Users, Shield,
  Sparkles, Menu, X, ChevronDown, Zap, Moon, Sun
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { TabId } from '../../types/index';

interface NavigationProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  isCommitteeMember?: boolean;
  committeeRole?: string | null;
}

export function Navigation({ 
  activeTab, 
  setActiveTab, 
  isCommitteeMember = false,
  committeeRole = null 
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      id: 'home' as TabId,
      label: 'Home',
      shortLabel: 'Home',
      icon: Home,
    },
    {
      id: 'dashboard' as TabId,
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      icon: BarChart3,
    },
    {
      id: 'invest' as TabId,
      label: 'Invest',
      shortLabel: 'Invest',
      icon: TrendingUp,
    },
    {
      id: 'submit' as TabId,
      label: 'Submit Invoice',
      shortLabel: 'Submit',
      icon: FileText,
    },
    {
      id: 'nft-marketplace' as TabId,
      label: 'NFT Gallery',
      shortLabel: 'NFT',
      icon: Sparkles,
    },
  ];

  // Add committee tab for committee members
  if (isCommitteeMember) {
    navigationItems.splice(2, 0, {
      id: 'committee' as TabId,
      label: 'Committee',
      shortLabel: 'Committee',
      icon: Shield,
    });
  }

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-xl shadow-black/5' 
        : 'bg-white/90 backdrop-blur-sm border-b border-white/10'
    }`}>
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5"></div>
      
      <div className="relative w-full max-w-none px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Premium Logo */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-2xl blur-sm opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 p-2.5 sm:p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent truncate tracking-tight">
                <span className="hidden sm:inline">EarnX Protocol</span>
                <span className="sm:hidden">EarnX</span>
              </h1>
              <p className="text-xs text-gray-600/80 hidden lg:block font-medium tracking-wide">Premium Trade Finance</p>
            </div>
          </div>

          {/* Premium Navigation Tabs */}
          <div className="hidden sm:flex items-center justify-center flex-1 mx-6">
            <div className="flex items-center bg-white/60 backdrop-blur-md rounded-2xl p-1.5 border border-white/20 shadow-lg shadow-black/5">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`relative flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap text-sm lg:text-base group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-xl opacity-100 animate-pulse-slow"></div>
                    )}
                    
                    <div className="relative flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-transform duration-300 ${
                        isActive ? 'rotate-3' : 'group-hover:rotate-3'
                      }`} />
                      <span className="hidden lg:inline font-semibold">{item.label}</span>
                      <span className="lg:hidden font-semibold">{item.shortLabel}</span>
                      
                      {item.id === 'committee' && (
                        <span className="hidden xl:inline text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg ml-1 font-medium">
                          {committeeRole?.split(' ')[0] || 'Member'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Premium Right Side */}
          <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="relative group p-2 rounded-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-gray-700/80 hover:shadow-lg transition-all duration-300 transform hover:scale-105 micro-bounce"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <div className="relative">
                {isDarkMode ? (
                  <Sun className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180" />
                ) : (
                  <Moon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </button>
            {/* Premium Committee Badge */}
            {isCommitteeMember && (
              <div className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm text-purple-700 px-4 py-2.5 rounded-xl border border-purple-200/50 shadow-sm hover:shadow-md transition-all duration-300">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-semibold">Committee</span>
              </div>
            )}

            {/* Committee Badge - Mobile */}
            {isCommitteeMember && (
              <div className="xl:hidden flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm text-purple-700 px-3 py-2 rounded-xl border border-purple-200/50">
                <Shield className="w-3 h-3" />
                <span className="text-xs font-semibold">Committee</span>
              </div>
            )}

            {/* Wallet Connect - Responsive */}
            <div className="min-w-0">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="relative group bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 text-sm lg:text-base whitespace-nowrap overflow-hidden transform hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                <span className="hidden md:inline">Connect Wallet</span>
                                <span className="md:hidden">Connect</span>
                              </div>
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="relative group bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-red-500/25 transition-all duration-300 text-xs sm:text-sm whitespace-nowrap transform hover:scale-105"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <span className="relative">Wrong Network</span>
                            </button>
                          );
                        }

                        return (
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Premium Chain Button */}
                            <button
                              onClick={openChainModal}
                              className="hidden lg:flex bg-white/60 backdrop-blur-md text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/80 hover:shadow-lg transition-all duration-300 items-center gap-2 border border-white/20"
                            >
                              {chain.hasIcon && (
                                <div
                                  style={{
                                    background: chain.iconBackground,
                                    width: 16,
                                    height: 16,
                                    borderRadius: 999,
                                    overflow: 'hidden',
                                  }}
                                >
                                  {chain.iconUrl && (
                                    <img
                                      alt={chain.name ?? 'Chain icon'}
                                      src={chain.iconUrl}
                                      style={{ width: 16, height: 16 }}
                                    />
                                  )}
                                </div>
                              )}
                              <span className="hidden xl:inline">{chain.name}</span>
                              <span className="xl:hidden">{chain.name?.slice(0, 6)}</span>
                            </button>

                            {/* Premium Account Button */}
                            <button
                              onClick={openAccountModal}
                              className="relative group bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 rounded-2xl font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 text-xs sm:text-sm lg:text-base min-w-0 transform hover:scale-105 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative flex items-center gap-2">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="hidden lg:inline truncate">
                                  {account.displayName}
                                  {account.displayBalance ? ` (${account.displayBalance})` : ''}
                                </span>
                                <span className="hidden sm:inline lg:hidden truncate">
                                  {account.displayName}
                                </span>
                                <span className="sm:hidden truncate">
                                  {account.displayName?.slice(0, 4)}...
                                </span>
                              </div>
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {/* Premium Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-3 rounded-2xl bg-white/60 backdrop-blur-md text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-lg transition-all duration-300 border border-white/20 transform hover:scale-105"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Premium Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden">
            <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-white/20 shadow-2xl shadow-black/10 mx-4 mt-2 rounded-2xl overflow-hidden">
              <div className="p-4 space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-semibold transition-all duration-300 text-sm transform hover:scale-102 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-white/80 hover:shadow-md'
                      }`}
                    >
                      <div className="relative">
                        <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 ${
                          isActive ? 'rotate-3' : 'group-hover:rotate-3'
                        }`} />
                        {isActive && (
                          <div className="absolute -inset-1 bg-white/20 rounded-full animate-ping"></div>
                        )}
                      </div>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.id === 'committee' && (
                        <span className="text-xs bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg font-medium">
                          {committeeRole?.split(' ')[0] || 'Member'}
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Mobile Committee Info */}
                {isCommitteeMember && (
                  <div className="mt-4 pt-4 border-t border-white/20">
                    <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm text-purple-700 px-4 py-3 rounded-xl border border-purple-200/50">
                      <Shield className="w-5 h-5" />
                      <div className="flex-1">
                        <span className="font-semibold">Committee Member</span>
                        {committeeRole && (
                          <div className="text-xs text-purple-600 mt-1">{committeeRole}</div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Premium Status Bar */}
      <div className="bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 backdrop-blur-sm border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2.5 sm:py-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-3 sm:gap-6 text-gray-700 min-w-0">
              <span className="flex items-center gap-2 flex-shrink-0 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-200/50">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="hidden sm:inline font-semibold">Live on Morph Testnet</span>
                <span className="sm:hidden font-semibold">Live</span>
              </span>
              <span className="hidden md:inline whitespace-nowrap text-gray-600 font-medium">Powered by Chainlink Oracles</span>
            </div>
            <div className="text-gray-600 text-xs sm:text-sm text-right min-w-0 truncate font-medium">
              {activeTab === 'home' && (
                <div className="bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-200/50">
                  <span className="hidden sm:inline">Welcome to EarnX Protocol</span>
                  <span className="sm:hidden">Welcome</span>
                </div>
              )}
              {activeTab === 'dashboard' && (
                <div className="bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-200/50">
                  <span className="hidden sm:inline">Your Investment Overview</span>
                  <span className="sm:hidden">Dashboard</span>
                </div>
              )}
              {activeTab === 'invest' && (
                <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-200/50">
                  <span className="hidden sm:inline">Investment Opportunities</span>
                  <span className="sm:hidden">Invest</span>
                </div>
              )}
              {activeTab === 'submit' && (
                <div className="bg-blue-500/10 px-3 py-1.5 rounded-xl border border-blue-200/50">
                  <span className="hidden sm:inline">Submit Trade Finance Invoice</span>
                  <span className="sm:hidden">Submit Invoice</span>
                </div>
              )}
              {activeTab === 'committee' && (
                <div className="bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-200/50">
                  <span className="hidden sm:inline">Committee Dashboard</span>
                  <span className="sm:hidden">Committee</span>
                </div>
              )}
              {activeTab === 'nft-marketplace' && (
                <div className="bg-pink-500/10 px-3 py-1.5 rounded-xl border border-pink-200/50">
                  <span className="hidden sm:inline">NFT Invoice Gallery</span>
                  <span className="sm:hidden">NFT Gallery</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
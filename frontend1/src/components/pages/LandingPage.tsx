import React from 'react';
import { ArrowRight, Play, Target, TrendingUp, Shield, Globe } from 'lucide-react';
import { TabId } from '@/types';

interface LandingPageProps {
  setActiveTab: (tab: TabId) => void;
  setShowVideo: (show: boolean) => void;
  totalVolume: number;
  currentAPR: number;
}

export function LandingPage({ 
  setActiveTab, 
  setShowVideo, 
  totalVolume, 
  currentAPR 
}: LandingPageProps) {

  return (
    <div className="min-h-screen pt-16 sm:pt-18">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        {/* Advanced Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/80 dark:from-slate-900/80 dark:via-gray-900 dark:to-emerald-900/80"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-purple-50/40 via-transparent to-pink-50/40 dark:from-purple-900/40 dark:via-transparent dark:to-pink-900/40"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent)] dark:bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.2),transparent)]"></div>
        </div>
        
        {/* Premium Floating Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl animate-float-delayed"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-purple-400/15 to-pink-400/15 rounded-full blur-lg animate-pulse"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        <div className="relative max-w-7xl mx-auto px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            {/* Premium Content */}
            <div className="space-y-10">
              {/* Premium Badge */}
              <div className="inline-flex items-center bg-white/80 backdrop-blur-md border border-white/40 px-6 py-3 rounded-2xl text-sm font-bold text-gray-800 shadow-xl shadow-black/5 hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mr-3 animate-pulse shadow-lg shadow-green-500/50"></div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent font-black">Live on Morph Testnet</span>
              </div>
              
              {/* Premium Headline */}
              <div className="space-y-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tight">
                  <span className="block">Break the $40B</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent animate-gradient-x">
                    Finance Gap
                  </span>
                </h1>
                
                <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium max-w-2xl">
                  <span className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-300 dark:to-gray-100 bg-clip-text text-transparent">
                    African exporters can't access capital. Global investors can't find yields. 
                    We solve both problems with verified invoice tokenization.
                  </span>
                </p>
              </div>

              {/* Premium CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-start gap-6 pt-8">
                <button 
                  onClick={() => setActiveTab('invest')}
                  className="group relative bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white px-10 py-5 rounded-3xl font-black text-xl transition-all duration-500 shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 transform hover:scale-110 flex items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                  <div className="relative flex items-center gap-3">
                    <span>Start Investing</span>
                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-500" size={24} />
                  </div>
                </button>
                
                <button 
                  onClick={() => setShowVideo(true)}
                  className="group relative bg-white/80 backdrop-blur-md border-2 border-white/40 text-gray-800 hover:text-gray-900 px-10 py-5 rounded-3xl font-black text-xl transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 transform hover:scale-110 flex items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="relative flex items-center gap-3">
                    <Play className="group-hover:scale-125 transition-transform duration-500" size={24} />
                    <span>Watch Demo</span>
                  </div>
                </button>
              </div>

              {/* Premium Live Stats */}
              <div className="pt-12">
                <div className="grid grid-cols-3 gap-8">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-6 rounded-2xl text-center lg:text-left shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${totalVolume.toLocaleString()}
                      </div>
                      <div className="text-gray-700 text-sm font-bold mt-2 uppercase tracking-wider">Volume Processed</div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-6 rounded-2xl text-center lg:text-left shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {currentAPR}%
                      </div>
                      <div className="text-gray-700 text-sm font-bold mt-2 uppercase tracking-wider">Target APR</div>
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative bg-white/60 backdrop-blur-md border border-white/40 p-6 rounded-2xl text-center lg:text-left shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105">
                      <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        3
                      </div>
                      <div className="text-gray-700 text-sm font-bold mt-2 uppercase tracking-wider">Active Invoices</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Premium Visual */}
            <div className="relative">
              {/* Premium Main Image Container */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-[2.5rem] blur-2xl transform group-hover:scale-110 transition-transform duration-700"></div>
                <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.3)] border border-white/40 bg-white/10 backdrop-blur-sm">
                  <img
                    src="/images/focused-african-entrepreneur-using-laptop-while-sitting-leather-chair_854300-1231.jpg"
                    alt="African entrepreneur with laptop representing digital trade finance"
                    className="w-full h-full object-cover max-h-[500px] hover:scale-105 transition-transform duration-700"
                    style={{ minHeight: '400px', background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
              
              {/* Premium Floating Cards */}
              <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-black/20 border border-white/50 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
                  <div>
                    <div className="text-sm font-black text-gray-900">Live Trading</div>
                    <div className="text-xs text-gray-600 font-semibold">Real-time</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white p-6 rounded-2xl shadow-2xl shadow-blue-500/40 transform hover:scale-110 transition-all duration-500 hover:shadow-3xl overflow-hidden">
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-500 animate-shimmer"></div>
                <div className="relative">
                  <div className="text-2xl font-black">15% APR</div>
                  <div className="text-sm opacity-90 font-semibold">Current Yield</div>
                </div>
              </div>
              
              {/* Additional Premium Elements */}
              <div className="absolute top-1/3 -left-8 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 transform hover:scale-110 transition-all duration-500">
                <div className="text-xs font-black text-gray-900 mb-1">NFT Tokens</div>
                <div className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">1,247</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works - Simple 3 steps */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              How EarnX Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to bridge African trade with global DeFi
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center space-y-6">
              {/* Step image */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-blue-700 space-y-2">
                    <Target className="w-12 h-12 mx-auto" />
                    <div className="text-sm font-medium">Invoice Submission</div>
                    <div className="text-xs opacity-80">African exporter submits invoice</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Submit Invoice</h3>
                <p className="text-gray-600">
                  African exporters submit trade invoices that get tokenized as NFTs
                </p>
              </div>
            </div>

            {/* Step 2 - Updated for Chainlink Functions & Gov API */}
            <div className="text-center space-y-6">
              {/* Step image */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-emerald-700 space-y-2">
                    <Shield className="w-12 h-12 mx-auto" />
                    <div className="text-sm font-medium">Automated Verification</div>
                    <div className="text-xs opacity-80">Chainlink Functions + Gov API</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Real-Time Verification</h3>
                <p className="text-gray-600">
                  Chainlink Functions instantly verifies invoices by calling official government APIs—no human committee needed.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-6">
              {/* Step image */}
              <div className="relative mb-6">
                <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center overflow-hidden">
                  <div className="text-center text-purple-700 space-y-2">
                    <TrendingUp className="w-12 h-12 mx-auto" />
                    <div className="text-sm font-medium">Global Investment</div>
                    <div className="text-xs opacity-80">Global investors/returns</div>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Global Investment</h3>
                <p className="text-gray-600">
                  DeFi investors fund verified invoices and earn sustainable yields
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Impact section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-6 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Bridging the $40B Gap
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Connecting African SMEs to global capital through transparent, blockchain-powered trade finance
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-emerald-400">$40B</div>
              <div className="text-gray-300">Finance Gap</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-blue-400">54</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-purple-400">1.3B</div>
              <div className="text-gray-300">People</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl md:text-5xl font-bold text-yellow-400">15%</div>
              <div className="text-gray-300">Target APR</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-white py-24">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Ready to Start?
            </h2>
            <p className="text-xl text-gray-600">
              Join the future of trade finance today
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setActiveTab('invest')}
              className="group bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 flex items-center"
            >
              <Globe className="mr-3" size={24} />
              Invest Now
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
            </button>
            
            <button 
              onClick={() => setActiveTab('submit')}
              className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-700 px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:shadow-lg flex items-center"
            >
              <Target className="mr-3" size={24} />
              Submit Invoice
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}  
import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Search, Download, RotateCcw, Share2, Info } from 'lucide-react';
import { tiers, players } from './data/players';
import { PlayerPool } from './components/PlayerPool';
import { TierRow } from './components/TierRow';
import type { TierListState } from './types';
import html2canvas from 'html2canvas';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showTutorial, setShowTutorial] = useState(() => {
    return !localStorage.getItem('tutorialSeen');
  });
  const [tierList, setTierList] = useState<TierListState>(() => {
    const saved = localStorage.getItem('tierList');
    return saved ? JSON.parse(saved) : {};
  });
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    localStorage.setItem('tierList', JSON.stringify(tierList));
  }, [tierList]);

  useEffect(() => {
    if (showTutorial) {
      localStorage.setItem('tutorialSeen', 'true');
    }
  }, [showTutorial]);

  const handleDrop = (playerId: string, tierId: string) => {
    setTierList(prev => {
      const newTierList = { ...prev };
      
      // Remove player from previous tier
      Object.keys(newTierList).forEach(tier => {
        newTierList[tier] = newTierList[tier]?.filter(id => id !== playerId) || [];
      });
      
      // Add player to new tier
      newTierList[tierId] = [...(newTierList[tierId] || []), playerId];
      
      return newTierList;
    });
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your tier list? This cannot be undone.')) {
      setTierList({});
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById('tier-list');
    if (!element || isDownloading) return;

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.download = 'real-madrid-tier-list.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error downloading image:', error);
      alert('Failed to download the image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Real Madrid CF Player Tier List',
          text: 'Check out my Real Madrid CF player tier list!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const getPlayersForTier = (tierId: string) => {
    const playerIds = tierList[tierId] || [];
    return playerIds.map(id => players.find(p => p.id === id)!).filter(Boolean);
  };

  const unassignedPlayers = players.filter(
    player => !Object.values(tierList).flat().includes(player.id)
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-[#004D98] to-[#A50044]">
        <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">
              Real Madrid CF Player Tier List
            </h1>
            <p className="text-gray-200 mb-4 sm:mb-6 px-4">
              Drag and drop players to create your ultimate Real Madrid tier list
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-8">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#004D98] rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">Reset</span>
              </button>
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#004D98] rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Download size={18} />
                <span className="hidden sm:inline">
                  {isDownloading ? 'Downloading...' : 'Download'}
                </span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#004D98] rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </button>
              <button
                onClick={() => setShowTutorial(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white text-[#004D98] rounded-lg hover:bg-gray-100 transition-colors text-sm sm:text-base"
              >
                <Info size={18} />
                <span className="hidden sm:inline">Help</span>
              </button>
            </div>

            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#004D98]"
              />
            </div>
          </header>

          <main className="space-y-4 sm:space-y-8">
            <div id="tier-list" className="bg-white rounded-lg shadow-xl overflow-hidden mb-4 sm:mb-8">
              {tiers.map((tier) => (
                <TierRow
                  key={tier.id}
                  tier={tier}
                  players={getPlayersForTier(tier.id)}
                  onDrop={handleDrop}
                />
              ))}
            </div>

            <PlayerPool
              players={unassignedPlayers}
              filter={searchTerm}
            />
          </main>

          {showTutorial && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-md">
                <h2 className="text-xl font-bold mb-4">How to Use</h2>
                <ol className="list-decimal list-inside space-y-2 mb-6">
                  <li>Drag players from the pool below</li>
                  <li>Drop them into your preferred tier</li>
                  <li>Use the search bar to find specific players</li>
                  <li>Filter between current players and legends</li>
                  <li>Download or share your completed tier list</li>
                </ol>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full px-4 py-2 bg-[#004D98] text-white rounded-lg hover:bg-[#003D78] transition-colors"
                >
                  Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;
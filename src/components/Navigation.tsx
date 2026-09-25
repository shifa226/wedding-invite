import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { weddingData } from '../data/weddingData';

interface NavigationProps {
  onReopenEnvelope: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onReopenEnvelope }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Couple', href: '#couple' },
    { label: 'Families', href: '#families' },
    { label: 'Nikah', href: '#nikah' },
    { label: 'Valima', href: '#valima' },
    { label: 'Location', href: '#location' },
    { label: 'RSVP', href: '#rsvp' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#04140f]/90 backdrop-blur-md border-b border-[#cca052]/20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#home"
          className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-[#fce8a6] hover:text-white transition-colors flex items-center gap-2"
        >
          <span>{weddingData.couple.monogram}</span>
          <span className="text-[#cca052] font-normal text-xs tracking-widest hidden sm:inline">
            · ROYAL WEDDING
          </span>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-cinzel tracking-widest text-[#dfba73]/80">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#fce8a6] hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Re-open Envelope */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReopenEnvelope}
            className="text-[11px] font-cinzel tracking-wider text-[#cca052]/70 hover:text-[#fce8a6] transition-colors hidden sm:block whitespace-nowrap"
            title="Experience the 3D card opening again"
          >
            Re-Seal Card
          </button>

          <a
            href="#rsvp"
            className="px-4 py-2 rounded-full border border-[#cca052] text-[#fce8a6] hover:bg-[#cca052] hover:text-[#04140f] font-cinzel text-xs tracking-widest uppercase transition-all whitespace-nowrap"
          >
            RSVP
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-[#cca052] hover:text-[#fce8a6] transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#030e0a]/95 border-b border-[#cca052]/30 px-6 py-5 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="font-cinzel text-sm text-[#fce8a6]/90 hover:text-white tracking-widest py-1 border-b border-[#cca052]/10"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onReopenEnvelope();
            }}
            className="text-left font-cinzel text-xs text-[#cca052] tracking-widest pt-2"
          >
            ↺ Re-seal &amp; Open Envelope Again
          </button>
        </div>
      )}
    </header>
  );
};

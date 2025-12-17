import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
}

/**
 * Google AdSense Component
 * 
 * Place this component anywhere you want to display ads.
 * Make sure you've added the AdSense script to index.html first.
 * 
 * Usage:
 * <AdSense adSlot="1234567890" adFormat="rectangle" />
 */
export function AdSense({
  adSlot,
  adFormat = 'auto',
  adStyle = { display: 'block' },
  className = ''
}: AdSenseProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={adStyle}
        data-ad-client="ca-pub-3682629335220551"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}

/**
 * Pre-configured ad placements for common locations
 */

// Homepage sidebar ad (300x600)
export function SidebarAd() {
  return (
    <AdSense
      adSlot="SIDEBAR_SLOT_ID"
      adFormat="vertical"
      adStyle={{
        display: 'inline-block',
        width: '300px',
        height: '600px'
      }}
      className="my-4"
    />
  );
}

// Content rectangle ad (336x280)
export function ContentAd() {
  return (
    <AdSense
      adSlot="CONTENT_SLOT_ID"
      adFormat="rectangle"
      adStyle={{
        display: 'inline-block',
        width: '336px',
        height: '280px'
      }}
      className="my-6 mx-auto"
    />
  );
}

// Horizontal banner ad (728x90)
export function BannerAd() {
  return (
    <AdSense
      adSlot="BANNER_SLOT_ID"
      adFormat="horizontal"
      adStyle={{
        display: 'inline-block',
        width: '728px',
        height: '90px'
      }}
      className="my-4"
    />
  );
}

// Mobile-optimized ad (320x100)
export function MobileAd() {
  return (
    <AdSense
      adSlot="MOBILE_SLOT_ID"
      adFormat="horizontal"
      adStyle={{
        display: 'inline-block',
        width: '320px',
        height: '100px'
      }}
      className="my-4 md:hidden"
    />
  );
}

// Responsive ad (auto-sized)
export function ResponsiveAd({ adSlot = "AUTO_SLOT_ID" }: { adSlot?: string }) {
  return (
    <AdSense
      adSlot={adSlot}
      adFormat="auto"
      className="my-6"
    />
  );
}

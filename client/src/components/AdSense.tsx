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

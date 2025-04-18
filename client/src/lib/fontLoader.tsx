import { useEffect } from "react";
import { dom } from "@fortawesome/fontawesome-svg-core";

// This component ensures FontAwesome styles are properly loaded
export default function FontLoader() {
  useEffect(() => {
    // Add FontAwesome styles to the document
    if (dom && dom.css) {
      const styleElement = document.createElement('style');
      styleElement.appendChild(document.createTextNode(dom.css()));
      document.head.appendChild(styleElement);
    }
    
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Montserrat:wght@300;400;500;600&family=Tangerine:wght@400;700&display=swap';
    document.head.appendChild(link);
    
    // We're using the React FontAwesome package, so we don't need the CDN version
    // This avoids conflicts between the two methods
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return null;
}

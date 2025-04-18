import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    
    // Add Font Awesome CDN
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
    
    return () => {
      document.head.removeChild(link);
      document.head.removeChild(fontAwesomeLink);
    };
  }, []);
  
  return null;
}

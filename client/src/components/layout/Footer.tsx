import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon } from "@fortawesome/free-solid-svg-icons";
import { 
  faInstagram, 
  faTwitter, 
  faFacebook, 
  faTiktok 
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-purple-950 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FontAwesomeIcon 
              icon={faMoon} 
              className="text-amber-500 text-xl mr-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" 
            />
            <h3 className="font-['Cinzel'] text-xl text-amber-500">Mystic Fortune</h3>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="TikTok">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
          
          <div className="text-center md:text-right text-sm text-white/70">
            <p>&copy; {new Date().getFullYear()} Mystic Fortune. All destinies reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

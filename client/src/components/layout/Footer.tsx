import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-purple-950 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <i className="fas fa-moon text-amber-500 text-xl mr-2 filter drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]"></i>
            <h3 className="font-['Cinzel'] text-xl text-amber-500">Mystic Fortune</h3>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-white hover:text-amber-500 transition-colors" aria-label="TikTok">
              <i className="fab fa-tiktok"></i>
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

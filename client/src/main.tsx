import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Import FontAwesome icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons to the library
library.add(fab, fas);

createRoot(document.getElementById("root")!).render(<App />);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css';
import {ConfigProvider} from './context/ConfigContext.jsx';
import {ParallaxProvider} from "react-scroll-parallax";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <HelmetProvider>
        <ParallaxProvider>
            <ConfigProvider>
                <App />
            </ConfigProvider>
        </ParallaxProvider>
        </HelmetProvider>
    </StrictMode>,
)

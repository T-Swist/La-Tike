import { FiArrowLeft } from 'react-icons/fi'
import ComingSoonBgImg from '../assets/images/Group 20.png'

const ComingSoonPage = () => {
    return (
        <section className="relative min-h-screen bg-black overflow-hidden flex flex-col">
            {/* Arrow at top left */}
            <div className="absolute top-28 left-6 z-10">
                <a 
                    href="/" 
                    className="text-bronze hover:text-bronze/80 transition-colors flex items-center justify-center w-10 h-10 rounded-full bg-bronze/20"
                >
                    <FiArrowLeft className="text-xl md:text-2xl" />
                </a>
            </div>
            
            {/* Centered content */}
            <div className="flex-grow flex flex-col items-center justify-center px-6 py-16 relative z-10">
                <div className="text-center max-w-md md:max-w-lg">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 font-glass">
                        GetMazza Gallery <br />
                        <span className="text-4xl md:text-5xl text-bronze">Coming Soon</span>
                    </h1>
                    <div className="space-y-4 text-white/80">
                        <p className="text-base md:text-lg leading-relaxed">
                            We're curating unforgettable moments from 
                            the events you love. From concerts to conferences,
                            our gallery will showcase the energy, excitement, 
                            and experience that is GetMazza.
                        </p>
                        <p className="text-base md:text-lg">
                            Stay tuned as we build something special.
                        </p>
                    </div>
                </div>
            </div>

            {/* Background image */}
            <div className="absolute bottom-16 right-48 z-0 opacity-50 md:opacity-70">
                <img 
                    src={ComingSoonBgImg} 
                    alt="Coming Soon" 
                    className="w-64 h-48 md:w-80 md:h-60 object-contain object-right-bottom"
                />
            </div>
        </section>
    )
}

export default ComingSoonPage
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Img1 from "../../assets/images/Social club.jpg";
import Img2 from "../../assets/images/Plane 2.jpg";
import Img3 from "../../assets/images/Dinning.jpg";

const EventsCurated = () => {
    return (
        <section className="bg-black w-full py-8 md:py-12 lg:py-16 overflow-hidden">
            <div className="container max-w-6xl px-4 mx-auto md:px-6 lg:px-8 mb-8 md:mb-12">
                <h3 className='font-glass text-white text-2xl md:text-3xl lg:text-4xl text-center md:text-left'>
                    Events Curated for <br className="hidden md:block" />
                    your satisfaction
                </h3> 
            </div>
            
            <div className="container max-w-6xl px-4 mx-auto md:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                    {/* Card 1 */}
                    <div className="flex flex-col group">
                        <div className="overflow-hidden rounded-md mb-4">
                            <img 
                                src={Img1} 
                                alt="Social Club" 
                                className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col space-y-3 md:space-y-4">
                            <h3 className="text-white font-glass text-xl md:text-2xl">Social Club</h3>
                            <p className="text-gray-400 font-wellston text-sm md:text-base">
                                Access the most exclusive clubs and secret spots designed to connect
                                you with like-minded individuals and unforgettable experiences
                            </p>
                            <Link 
                                to="#" 
                                className="text-white flex items-center gap-x-2 text-sm md:text-base group-hover:text-bronze transition-colors duration-300"
                            >
                                See More <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="flex flex-col group">
                        <div className="overflow-hidden rounded-md mb-4">
                            <img 
                                src={Img2} 
                                alt="Travel" 
                                className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col space-y-3 md:space-y-4">
                            <h3 className="text-white font-glass text-xl md:text-2xl">Travel</h3>
                            <p className="text-gray-400 font-wellston text-sm md:text-base">
                                From luxury hotels to secluded islands and breathtaking beach escapes,
                                our perfect travel concierge is here to craft your ideal getaway,
                                exactly as you dreamt it
                            </p>
                            <Link 
                                to="#" 
                                className="text-white flex items-center gap-x-2 text-sm md:text-base group-hover:text-bronze transition-colors duration-300"
                            >
                                See More <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="flex flex-col group">
                        <div className="overflow-hidden rounded-md mb-4">
                            <img 
                                src={Img3} 
                                alt="Fine Dining & NightLife" 
                                className="w-full h-48 md:h-56 lg:h-64 object-cover rounded-md transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="flex flex-col space-y-3 md:space-y-4">
                            <h3 className="text-white font-glass text-xl md:text-2xl">Fine Dining & NightLife</h3>
                            <p className="text-gray-400 font-wellston text-sm md:text-base">
                                Savor the luxury of anytime reservations, indulge in Michelin-starred dining,
                                and enjoy exclusive private events, all at your fingertips
                            </p>
                            <Link 
                                to="#" 
                                className="text-white flex items-center gap-x-2 text-sm md:text-base group-hover:text-bronze transition-colors duration-300"
                            >
                                See More <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default EventsCurated;
import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import DefaultSkeletion from '../components/DefaultSkeleton';
import ScrollToTop from '../components/ScrollToTop';
import Header from '../components/shared/header';
import Footer from '../components/shared/footer';
import WhatsAppButton from '../components/shared/WhatsAppButton';

// Lazy load pages
const Home = lazy(() => import("../pages/Home"));
const OurStory = lazy(() => import("../pages/OurStory"));
const Services = lazy(() => import("../pages/Services"));
const Gallery = lazy(() => import("../pages/Gallery"));
const Tickets = lazy(() => import("../pages/Tickets"));
const Merch = lazy(() => import("../pages/Merch"));
const Podcast = lazy(() => import("../pages/Podcast"));
const Membership = lazy(() => import("../pages/Membership"));
const ComingSoonPage = lazy(() => import("../pages/ComingSoonPage"));

 const AppRoutes = () => {
   return (
     <Suspense fallback={<DefaultSkeletion />}>
       <Header />
       <div className="min-h-screen flex flex-col bg-transparent">
         <main className="flex-grow">
           <ScrollToTop />
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/our-story" element={<OurStory />} />
             <Route path="/coming-soon" element={<ComingSoonPage />} />
             <Route path="/services" element={<Services />} />
             <Route path="/gallery" element={<Gallery />} />
             <Route path="/tickets" element={<Tickets />} />
             <Route path="/merch" element={<Merch />} />
             <Route path="/podcast" element={<Podcast />} />
             <Route path="/membership" element={<Membership />} />
           </Routes>
         </main>
       </div>
       <WhatsAppButton />
       <Footer />
     </Suspense>
   )
 }

 export default AppRoutes
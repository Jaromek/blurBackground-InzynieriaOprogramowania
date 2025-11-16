import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaAppleAlt, FaBarcode, FaUsers, FaCookieBite } from 'react-icons/fa';
import BlurText from "./components/BlurText.js";
import { PlayCircle, Square, XCircle } from 'lucide-react';
import  VIDEO_PLACEHOLDER from "/Users/natalatomala/blr/blr/src/image 11.png";
import FlowingMenu from './components/FlowingMenu'
import SectionOne from './Section1.js';
import SectionTwo from './Section2.js';
import SectionThree from './Section3.js';
import SectionFour from './Section4.js';


const AboutUsWidget = ({ toggleAboutUs }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full relative flex flex-col md:flex-row gap-8 shadow-xl">
                <button
                    onClick={toggleAboutUs}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200 z-10"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div className="flex-1 text-black">
                    <h2 className="text-3xl font-bold mb-4 font-[Climate_Crisis]">About Us</h2>
                    <p className="mb-4 text-sm text-gray-700">

                    </p>
                    <p className="mb-4 text-sm text-gray-700">
                    </p>
                    <p className="text-sm text-gray-700">
                        Thank you for joining our community!
                    </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center justify-center text-center">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-4 border-gray-300">
                       
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2"> Nice to meet you!</h3>
                    <div className="flex gap-4">
                        <a href="https://www.facebook.com/talianacia16" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600 transition-colors duration-200"><FaFacebookF size={24} /></a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors duration-200"><FaTwitter size={24} /></a>
                        <a href="https://www.linkedin.com/in/nataliatomala4444" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-700 transition-colors duration-200"><FaLinkedinIn size={24} /></a>
                        <a href="https://www.instagram.com/avenatka/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500 transition-colors duration-200"><FaInstagram size={24} /></a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FreedgeWidget = ({ toggleFreedgeWidget }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full relative flex flex-col md:flex-row gap-8 shadow-xl">
                <button
                    onClick={toggleFreedgeWidget}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200 z-10"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <div className="flex-1 w-full text-black">
                    <h2 className="text-3xl font-bold mb-4 font-[Climate_Crisis]">Our Initiative</h2>
                    <p className="mb-4 text-sm text-gray-700">
Watch the video to see more. 
                    </p>
                </div>
                <div className="flex-shrink-0 w-full md:w-1/3 flex flex-col items-center justify-center text-center">
                    <div className="w-full h-full md:h-48 rounded-xl overflow-hidden mb-4 border-4 border-gray-300">
                        <a href="https://www.youtube.com/watch?v=your-video-id" target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://img.youtube.com/vi/your-video-id/mqdefault.jpg"
                                alt="Freedge YouTube Thumbnail"
                                className="w-full h-full object-cover"
                            />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureButton = ({ children, isActive = false, onClick }) => (
    <motion.button
        className={`w-full h-[12vw] text-lg md:text-xl font-semibold px-6 py-4 rounded-xl transition-colors duration-300 shadow-md ${
            isActive 
                ? 'bg-gray-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
    >
        {children}
    </motion.button>
);


const SupportDropdown = React.forwardRef(({ onClose }, ref) => { 
    const [openIndex, setOpenIndex] = useState(null);
    const faqItems = [
        {
            question: 'How do I create an account?',
            answer: 'To create an account, go to the "Log in" section and select the "Create new account" option. Follow the instructions to complete your data.'
        },
        {
            question: 'How can I contact customer support?',
            answer: 'The fastest way is to use the contact form next to this section. You can also send us an email at support@freedge.com.'
        },
        {
            question: 'Is the app free?',
            answer: 'Yes, our application is completely free. We offer optional premium features that can be activated at any time.'
        },
    ];

    const togglePanel = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div ref={ref} className="support-dropdown-container absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl bg-white text-black py-16 shadow-lg z-40 rounded-xl">
            
            <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition-colors duration-200 z-10"
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div className="container mx-auto px-4 md:px-16 flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                    <h4 className="text-4xl font-bold mb-6 font-[Climate_Crisis] text-center md:text-left">FAQ</h4>
                    {faqItems.map((item, index) => (
                        <div key={index} className="border-b-2 border-gray-200">
                            <div
                                className="font-semibold cursor-pointer py-4 flex justify-between items-center rounded-lg px-2 transition-all duration-300 ease-in-out hover:bg-gray-100" // Zmniejszony px z 10 na 2
                                onClick={() => togglePanel(index)}
                            >
                                {item.question}
                                <span className="text-lg font-bold">{openIndex === index ? '−' : '+'}</span>
                            </div>
                            <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-96 opacity-100 py-2' : 'max-h-0 opacity-0'}`}
                            >
                                <p className="text-gray-600 text-sm pl-2">{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full md:w-1/3 bg-gray-100 rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <h4 className="text-xl font-bold mb-4">Contact Us</h4>
                
                        <input type="email" placeholder="Your email" className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-sm" />
                        <textarea placeholder="Your message" className="w-full p-3 border border-gray-300 rounded-lg mb-6 h-32 text-sm"></textarea>
                        <button className="w-full bg-black text-white px-4 py-3 rounded-full hover:bg-gray-800 font-semibold transition-colors duration-200">Send Message</button>
                    </div>

                    <div className="flex justify-center md:justify-center gap-4 mt-6">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors duration-200">
                            <FaFacebookF size={24} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors duration-200">
                            <FaTwitter size={24} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors duration-200">
                            <FaInstagram size={24} />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors duration-200">
                            <FaLinkedinIn size={24} />
                        </a>

                    </div>
                </div>
            </div>
        </div>
    );
});

const Navbar = ({ donateRef, toggleAboutUs, toggleFreedgeWidget, handleSupportClick, handleFeaturesClick, isFeaturesOpen, isSupportOpen, setIsFeaturesOpen, setIsSupportOpen, scrollToFeatures }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleFeatures = (e) => {
         e.preventDefault();
         scrollToFeatures(); // <-- Use the new scroll function
         setIsMobileMenuOpen(false);
    };

    const handleSupport = (e) => {
        e.preventDefault();
        handleSupportClick();
        setIsMobileMenuOpen(false);
    };

    const handleMobileMenuClick = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        setIsFeaturesOpen(false);
        setIsSupportOpen(false);
    };

    const handleDonateClick = (e) => {
        e.preventDefault();

        if (donateRef && donateRef.current) {
            donateRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
        setIsMobileMenuOpen(false);
    };
    
 
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const initialNavbarStyle = "bg-transparent border-2 border-solid border-white text-white shadow-lg rounded-[3rem] px-8 py-4";
    const scrolledNavbarStyle = "bg-transparent border-2  border-white text-white rounded-full px-8 py-3"; // Poprawione style paska przewijania

    return (
        <>
            <header
                className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95%] max-w-7xl opacity-100
                ${isScrolled ? scrolledNavbarStyle : initialNavbarStyle}`}
            >
                <div className="flex justify-between items-center relative ">
                    <div className="flex flex-col text-2xl font-black leading-none">
                        <span></span>
                        <span>BLLURED</span>
                    </div>

                  
                    {!isScrolled && (
                        <nav className="hidden md:flex space-x-2 text-sm font-semibold">
                            <a href="#" onClick={handleFeatures} className="hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300">FEATURES</a>
                            <a href="#" onClick={handleSupport} className="hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300">SUPPORT</a>
                            <a
                                href="#"
                                onClick={handleDonateClick}
                                className="hover:bg-gray-200 hover:text-gray-900 px-4 py-2 rounded-full transition-all duration-300"
                            >
                                DONATE
                            </a>
                        </nav>
                    )}
                    
                   
                    {isScrolled && (
                         <nav className="hidden md:flex space-x-2 text-sm font-semibold">
                            <a href="#" onClick={handleFeatures} className="hover:bg-gray-800 px-4 py-2 rounded-full transition-all duration-300">FEATURES</a>
                            <a href="#" onClick={handleSupport} className="hover:bg-gray-800 px-4 py-2 rounded-full transition-all duration-300">SUPPORT</a>
                            <a
                                href="#"
                                onClick={handleDonateClick}
                                className="hover:bg-gray-800 px-4 py-2 rounded-full transition-all duration-300"
                            >
                                DONATE
                            </a>
                        </nav>
                    )}


                    <div className="flex gap-4 items-center">
                        {isScrolled ? (
                            <>
                               
                                <a
                                    href="https://play.google.com/store/apps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold border-2 border-white transform hover:scale-105 hover:bg-transparent hover:text-white transition-all duration-300"
                                >
                                    GET BLLURED
                                </a>
                                
                                <button
                                    onClick={handleMobileMenuClick}
                                    className="w-12 h-12 bg-white rounded-full flex items-center justify-center md:hidden" // Dodano md:hidden
                                >
                                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="hidden md:block w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-black transition-colors duration-200">
                                    <span>&#9788;</span> 
                                </button>
                               
                                <a
                                    href="https://play.google.com/store/apps"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-6 py-2 bg-black text-white rounded-full text-sm font-bold border-2 border-black transform hover:scale-105 hover:bg-white hover:text-black transition-all duration-300 hidden md:block" // Dodany hidden md:block
                                >
                                    GET BLLURED
                                </a>
                                <button
                                    onClick={handleMobileMenuClick}
                                    className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center md:hidden"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                </div>

             
                {isSupportOpen && <SupportDropdown onClose={() => setIsSupportOpen(false)} />} 
                {isMobileMenuOpen && (
                    <div className={`absolute right-0 top-20 rounded-2xl shadow-lg p-6 w-48 space-y-4 md:hidden
                        ${isScrolled ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        <a href="#features" className="block hover:text-pink-500" onClick={handleFeatures}>FEATURES</a>
                        <a href="#" className="block hover:text-gray-500" onClick={handleSupport}>SUPPORT</a>
                        <a href="#donate" className="block hover:text-gray-500" onClick={handleDonateClick}>DONATE</a>
                        <a
                            href="https://play.google.com/store/apps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 bg-pink-500 text-white rounded-full text-sm font-bold text-center mt-4"
                        >
                            GET BLLURED
                        </a>
                    </div>
                )}
            </header>
        </>
    );
};


const ScrollIndicator = ({ activeSection }) => {
    const dots = [0, 1, 2, 3];
    return (
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col items-center">
            <div className="w-2 h-48 bg-gray-900/50 rounded-full relative flex flex-col items-center justify-center space-y-2 py-4">
                {dots.map((index) => (
                    <div
                        key={index}
                        className={`
                            transition-all duration-300 ease-in-out
                            ${activeSection === index
                                ? "w-4 h-4 bg-white rounded-full border-2 border-black" // Zmieniono na bardziej widoczne kropki
                                : "w-2 h-2 bg-white/40 rounded-full"
                            }`}
                    ></div>
                ))}
            </div>
        </div>
    );
};


const App = () => {
 //const [showIntro, setShowIntro] = useState(false); 
    const [showAboutUs, setShowAboutUs] = useState(false);
    const [showFreedgeWidget, setShowFreedgeWidget] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
    const [isSupportOpen, setIsSupportOpen] = useState(false);

    const sectionOneRef = useRef(null);
    const sectionTwoRef = useRef(null);
    const sectionThreeRef = useRef(null);
    const sectionFourRef = useRef(null);
    const donateRef = sectionFourRef;
    const supportRef = useRef(null); 

    const [activeSection, setActiveSection] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);

    //const handleAnimationComplete = () => {
    //    setShowIntro(false);
    //};
    const scrollToFeatures = () => {
       // Close other menus if needed
       setIsFeaturesOpen(false); 
       setIsSupportOpen(false);

        if (sectionThreeRef.current) {
            sectionThreeRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    };
    const toggleAboutUs = () => {
        setShowAboutUs(!showAboutUs);
    };

    const toggleFreedgeWidget = () => {
        setShowFreedgeWidget(!showFreedgeWidget);
    };
    

    const handleFeaturesClick = () => {
        setIsFeaturesOpen(!isFeaturesOpen);
        setIsSupportOpen(false); // Zamknij inne
    };

    const handleSupportClick = () => {
        setIsSupportOpen(!isSupportOpen);
        setIsFeaturesOpen(false); // Zamknij inne
    };
  const scrollToSupport = () => {
       setIsSupportOpen(true);
        setIsFeaturesOpen(false);

        setTimeout(() => {
            if (supportRef.current) {
                supportRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }, 100);
    };

    const handleClickOutside = (event) => {
        const featuresDropdown = document.querySelector('.features-dropdown-container');
        const supportDropdown = document.querySelector('.support-dropdown-container');
        const navbar = document.querySelector('header');

        if (navbar && !navbar.contains(event.target) &&
            (!featuresDropdown || !featuresDropdown.contains(event.target)) &&
            (!supportDropdown || !supportDropdown.contains(event.target))) {
            setIsFeaturesOpen(false);
            setIsSupportOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []); 
    useEffect(() => {
        
            const sections = [sectionOneRef, sectionTwoRef, sectionThreeRef, sectionFourRef];
            const observerOptions = {
                root: null,
                rootMargin: '-50% 0px -50% 0px',
                threshold: 0,
            };

            const observer = new IntersectionObserver((entries) => {
                let currentActiveIndex = -1;
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const index = sections.findIndex(ref => ref.current === entry.target);
                        currentActiveIndex = index;
                    }
                });

                if (currentActiveIndex !== -1) {
                    setActiveSection(currentActiveIndex);
                }
            }, observerOptions);

            sections.forEach(ref => {
                if (ref.current) {
                    observer.observe(ref.current);
                }
            });

            return () => {
                sections.forEach(ref => {
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                });
            };
        }
    , []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    

    return (
        <div className="bg-white min-h-screen font-sans">
            <Navbar 
                isScrolled={isScrolled} 
                donateRef={donateRef} 
                toggleAboutUs={toggleAboutUs} 
                toggleFreedgeWidget={toggleFreedgeWidget} 
                handleFeaturesClick={handleFeaturesClick} 
                handleSupportClick={handleSupportClick} 
                isFeaturesOpen={isFeaturesOpen}
                isSupportOpen={isSupportOpen}
                setIsFeaturesOpen={setIsFeaturesOpen}
                setIsSupportOpen={setIsSupportOpen}
                scrollToSupport={scrollToSupport} 
                scrollToFeatures={scrollToFeatures}
            />
            <ScrollIndicator activeSection={activeSection} />
            <main>
                <SectionOne ref={sectionOneRef} />
                <SectionTwo ref={sectionTwoRef} />
                <SectionThree ref={sectionThreeRef} />
                <SectionFour ref={sectionFourRef} toggleAboutUs={toggleAboutUs} toggleFreedgeWidget={toggleFreedgeWidget} scrollToSupport={scrollToSupport} />
            </main>
            {showAboutUs && <AboutUsWidget toggleAboutUs={toggleAboutUs} />}
            {showFreedgeWidget && <FreedgeWidget toggleFreedgeWidget={toggleFreedgeWidget} />}
            {isFeaturesOpen && setIsFeaturesOpen(false)}
            {isSupportOpen && <SupportDropdown ref={supportRef} onClose={() => setIsSupportOpen(false)} />}
        </div>
    );
};

export default App;


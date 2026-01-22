import React, { useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaTimes } from "react-icons/fa";
import BlurText from "./components/BlurText";

const SectionFour = React.forwardRef(({ toggleAboutUs, toggleFreedgeWidget, scrollToSupport }, ref) => {
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const backgroundColor = useTransform(scrollYProgress, [0.5, 0.7], ["#040405ff", "#B6C2DB"]);
    
    const handleAnimationComplete = () => { };

    return (
        <motion.div
            ref={ref}
            className="w-full relative min-h-[90vh] pt-24 pb-0 flex flex-col justify-between"
            style={{ backgroundColor }}
        >
            <div className="max-w-7xl mx-auto w-full px-8 md:px-16 flex flex-col gap-12 justify-center items-center">
                <BlurText
                    text="Integrate with us"
                    delay={300}
                    animateBy="words"
                    direction="top"
                    onAnimationComplete={handleAnimationComplete}
                    className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white/90 mb-12" 
                />

                <div className="flex flex-col md:flex-row gap-12 justify-center w-full">
                    <div className="bg-black text-white p-5 w-full max-w-md opacity-90">
                        <h3 className="text-3xl font-bold  mb-6 text-center">SIGN UP TO NEWSLETTER</h3>
                        <input
                            type="email"
                            placeholder="enter your email address"
                            className="w-full h-12 rounded-full mb-4 px-4 text-white text-sm outline-none focus:ring-2 focus:ring-gray-300 transition-all bg-gray-900 placeholder-white"
                        />
                        <button
                            className="
                                w-full px-6 py-3 bg-gray-300 text-black rounded-full font-bold
                                transform hover:scale-105
                                hover:bg-transparent hover:text-gray-300
                                transition-all duration-300
                            "
                        >
                            SUBSCRIBE
                        </button>
                        <p className="mt-4 text-[0.6rem] text-center opacity-70">
                            *I allow getting newsletter messages to my email address
                        </p>
                    </div>

                    <div className="bg-black text-white p-5 border-2 border-black w-full max-w-md">
                        <h3 className="text-3xl font-bold font-[Climate_Crisis] mb-6 text-center">DONATE</h3>
                        <input
                            type="number"
                            placeholder="enter amount in $"
                            className="w-full h-12 rounded-full mb-4 px-4 text-black text-sm outline-none focus:ring-2 focus:ring-gray-500 transition-all bg-transparent placeholder-gray-500 border border-gray-300"
                        />
                        <a
                            href="https://www.buymeacoffee.com/your-username"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                w-full px-6 py-3 bg-gray-500 text-white rounded-full font-bold text-center inline-block
                                transform hover:scale-105
                                hover:bg-transparent hover:text-gray-500
                                transition-all duration-300
                            "
                        >
                            THANKS!
                        </a>
                        <p className="mt-4 text-[0.6rem] text-center opacity-70">
                            *all donates are voluntary
                        </p>
                    </div>
                </div> 
            </div>

            <footer className="w-full mt-24 bg-black relative z-10"> 
                <div className="max-w-7xl mx-auto px-8 md:px-16 py-20 flex flex-col md:flex-row justify-between items-start text-white"> 
                    <div className="flex flex-col items-start mb-6 md:mb-0">
                        <div className="flex flex-col text-2xl font-black leading-none">
                            <span>BLUR</span>
                            <span></span>
                        </div>
                        <p className="text-sm"></p>
                    </div>

                    <div className="flex gap-12 font-bold mb-6 md:mb-0">
                        <button className="hover:text-gray-300 transition-colors uppercase" onClick={toggleFreedgeWidget}>BLUR</button> 
                        <button className="hover:text-gray-300 transition-colors uppercase" onClick={toggleAboutUs}>ABOUT US</button> 
                        <button className="hover:text-gray-300 transition-colors uppercase" onClick={scrollToSupport}>CONTACT</button> 
                    </div>

                    <div className="flex gap-2">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-white hover:ring-offset-2 transition-all duration-300">
                            <FaFacebookF className="text-black text-lg" />
                        </a>
                        <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-white hover:ring-offset-2 transition-all duration-300">
                            <FaTwitter className="text-black text-lg" />
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-white hover:ring-offset-2 transition-all duration-300">
                            <FaInstagram className="text-black text-lg" />
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-white hover:ring-offset-2 transition-all duration-300">
                            <FaLinkedinIn className="text-black text-lg" />
                        </a>
                        
                        <button 
                            onClick={() => setIsVideoOpen(true)}
                            className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:ring-2 hover:ring-white hover:ring-offset-2 transition-all duration-300 cursor-pointer"
                        >
                            <FaYoutube className="text-black text-lg" />
                        </button>
                    </div>
                </div>
            </footer>

            <AnimatePresence>
                {isVideoOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
                        onClick={() => setIsVideoOpen(false)}
                    >
                        <div 
                            className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button 
                                onClick={() => setIsVideoOpen(false)}
                                className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-all duration-300"
                            >
                                <FaTimes />
                            </button>
                            <iframe 
                                width="100%" 
                                height="100%" 
                                src="https://www.youtube.com/embed/LeeKC-RVJzI?autoplay=1" 
                                title="YouTube video player" 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
});

SectionFour.displayName = 'SectionFour';

export default SectionFour;
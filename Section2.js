import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PixelTransition from './components/PixelTransition.js';
import { PlayCircle, Square, XCircle } from 'lucide-react';

const VIDEO_PLACEHOLDER = 'https://via.placeholder.com/800x450.png?text=Video+Placeholder';

const featureDetails = {
    A: {
        title: "Instant Privacy: Background Blur",
        description: "Ensure immediate privacy and a polished, professional appearance, no matter your surroundings."
     
    },
    B: {
        title: "Precise Isolation: Smart Object Detection",
        description: "Leverage the power of Artificial Intelligence to accurately isolate yourself or key elements within the frame."
    }
};


const SectionTwo = React.forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const [isSwitched, setIsSwitched] = useState(false); 

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"] 
    });

    const centralTitleOpacity = useTransform(scrollYProgress, [0.05, 0.4], [1, 0]);
    const centralTitleScale = useTransform(scrollYProgress, [0.0, 0.4], [1, 0.8]);

   const activeFeature = isSwitched ? featureDetails.B : featureDetails.A;

    return (
        <div ref={containerRef} className="h-[200vh] bg-gray-50 relative"> 
            <div className="sticky top-0 h-screen flex items-center justify-center p-8 bg-black">
                
              
                    <motion.div
                    className="absolute z-10 text-center"
                    style={{ opacity: centralTitleOpacity, scale: centralTitleScale }}
                >
                    <h2 className="text-[12vw] md:text-[8vw] font-bold text-white leading-none">
                        BLURRED 
                    </h2>
                    <h2 className="text-[12vw] md:text-[8vw] font-bold text-white leading-none mt-[-2vw]">
                        BUT FOCUSED
                    </h2>
                </motion.div>
           <div className="relative w-full h-[80%] max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-8 z-20 opacity-90">
                    
                 <div className="flex flex-col justify-end p-8 bg-[#06141b] rounded-xl backdrop-blur-sm shadow-2xl h-80% lg:col-span-2">
                   <div className="flex-grow flex flex-col justify-end text-white space-y-4">
                            <div className="w-full  bg-[#11212d] rounded-lg mb-4">
                                <div className="p-4">
                                    <h3 className="font-bold text-xl block mb-2 transition-all duration-300">
                                        {activeFeature.title}
                                    </h3>
                                    <p className="text-sm transition-all duration-300">
                                        {activeFeature.description}
                                    </p>
                                </div>
                            </div>
                            
                       
                            <div className="flex space-x-4">
                                <button className="flex-1 px-6 py-3 bg-[#253745] text-white font-semibold rounded-lg hover:bg-gray-600 transition">
                                    1
                                </button>
                                <button className="flex-1 px-6 py-3 bg-[#253745] text-white font-semibold rounded-lg hover:bg-gray-600 transition">
                                    2
                                </button>
                            </div>
                        </div>

                        {/* switch */}
                        <div className="w-full mt-6 flex items-center justify-center bg-[#11212d] rounded-full h-12 p-1 relative">
                            <span 
                                className={`absolute left-0 top-0 h-full w-1/2 bg-[#253745] rounded-full transition-transform duration-300 ease-in-out ${isSwitched ? 'translate-x-full' : 'translate-x-0'}`}
                            ></span>
                            <button 
                                className={`relative flex-1 text-sm font-medium transition-colors duration-300 ${isSwitched ? 'text-gray-300' : 'text-white'}`}
                                onClick={() => setIsSwitched(false)}
                            >
                                BACKGROUND BLUR
                            </button>
                            <button 
                                className={`relative flex-1 text-sm font-medium transition-colors duration-300 ${isSwitched ? 'text-white' : 'text-gray-300'}`}
                                onClick={() => setIsSwitched(true)}
                            >
                                SMART OBJECT DETECTION
                            </button>
                        </div>
                    </div>

    
                    <div className="opacity-90 relative h-full overflow-hidden rounded-xl shadow-2xl lg:col-span-3">
                        <PixelTransition
                            className="w-full h-full custom-pixel-card"
                            firstContent={
                                <img
                                    src={VIDEO_PLACEHOLDER}
                                    alt="Default media content"
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                            }
                            secondContent={
                                <div
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        display: "grid",
                                        placeItems: "center",
                                        backgroundColor: "#111"
                                    }}
                                >
                                    <p style={{ fontWeight: 900, fontSize: "3rem", color: "white" }}>CONTROL WHAT THEY SEE</p>
                                </div>
                            }
                            gridSize={60}
                            pixelColor='black'
                            animationStepDuration={0.4}
                        />

                      
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-500/50 backdrop-blur-lg rounded-full p-2 flex space-x-4 z-30">
                            <button className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                                <PlayCircle className="w-6 h-6 text-gray-800" />
                            </button>
                            <button className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                                <Square className="w-6 h-6 text-gray-800" />
                            </button>
                            <button className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                                <Square className="w-6 h-6 text-gray-800" />
                            </button>
                            <button className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                                <Square className="w-6 h-6 text-gray-800" />
                            </button>
                            <button className="w-12 h-12 bg-gray-200/50 rounded-full flex items-center justify-center hover:bg-gray-200 transition">
                                <XCircle className="w-6 h-6 text-gray-800" />
                            </button>
                        </div>
                    </div>

                </div>

            

            </div>
        </div> )
});

export default SectionTwo;
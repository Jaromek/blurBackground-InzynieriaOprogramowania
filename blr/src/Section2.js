import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PixelTransition from './components/PixelTransition.js';

const IconPerson = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconPalette = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>);
const IconImage = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>);
const IconSettings = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path></svg>);
const IconPlay = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M8 5v14l11-7z"/></svg>);
const IconOBS = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon></svg>);

const VIDEO_PLACEHOLDER = 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2564&auto=format&fit=crop';

const featuresList = [
    {
        id: 'blur',
        title: "PRIVACY BLUR",
        description: "Instantly blur your background using Gaussian algorithms. Perfect for hiding messy rooms during professional calls without losing focus on you.",
        relatedIcon: 'person' 
    },
    {
        id: 'segmentation',
        title: "YOLOv8 SEGMENTATION",
        description: "Powered by Ultralytics YOLOv8 AI model. It detects humans with high precision in real-time, separating the subject from the environment dynamically.",
        relatedIcon: 'play'
    },
    {
        id: 'color',
        title: "CHROMA KEY REPLACEMENT",
        description: "Need a Green Screen without the screen? Replace your background with any solid HEX color for seamless integration with other software.",
        relatedIcon: 'palette'
    },
    {
        id: 'virtual',
        title: "VIRTUAL SCENERY",
        description: "Upload any custom image from your device. Transport yourself to an office, a beach, or a branded studio backdrop in seconds.",
        relatedIcon: 'image'
    },
    {
        id: 'obs',
        title: "OBS INTEGRATION",
        description: "Direct pipeline to Open Broadcaster Software. Push your enhanced video feed to your favorite streaming platform with zero-configuration linking.",
        relatedIcon: 'obs'
    },
    {
        id: 'reset',
        title: "INSTANT RESET",
        description: "Return to your original camera feed with a single click. Full control over your appearance with zero latency toggle.",
        relatedIcon: 'settings'
    }
];

const SectionTwo = React.forwardRef((props, ref) => {
    const containerRef = useRef(null);
    const [activeTab, setActiveTab] = useState(featuresList[0].id);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"] 
    });

    const centralTitleOpacity = useTransform(scrollYProgress, [0.05, 0.4], [1, 0]);
    const centralTitleScale = useTransform(scrollYProgress, [0.0, 0.4], [1, 0.8]);

    const activeFeatureData = featuresList.find(f => f.id === activeTab);

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

                <div className="relative w-full h-[85%] max-w-7xl grid grid-cols-1 lg:grid-cols-5 gap-6 z-20 opacity-90">
                    
                    <div className="flex flex-col p-6 bg-[#0a0a0a]/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl lg:col-span-2">
                        
                        <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/5 min-h-[180px] flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-black mb-3 transition-all">
                                {activeFeatureData.title}
                            </h3>
                            <p className="text-gray-300 text-sm leading-relaxed">
                                {activeFeatureData.description}
                            </p>
                        </div>

                        <div className="flex-grow flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar">
                            {featuresList.map((feature) => (
                                <button
                                    key={feature.id}
                                    onClick={() => setActiveTab(feature.id)}
                                    className={`text-left px-5 py-4 rounded-lg text-sm font-medium transition-all duration-300 border ${
                                        activeTab === feature.id 
                                        ? 'bg-white/10 border-white/20 text-white shadow-lg translate-x-1' 
                                        : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                    }`}
                                >
                                    <span className="mr-3 opacity-50">0{featuresList.indexOf(feature) + 1}.</span>
                                    {feature.title}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-full overflow-hidden rounded-2xl shadow-2xl lg:col-span-3 bg-black border border-white/10 group">
                        
                        <PixelTransition
                            className="w-full h-full custom-pixel-card"
                            firstContent={
                                <img
                                    src={VIDEO_PLACEHOLDER}
                                    alt="Interface Preview"
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500"
                                />
                            }
                            secondContent={
                                <div className="w-full h-full grid place-items-center bg-[#111]">
                                    <p className="font-black text-4xl text-white tracking-widest">CONTROL WHAT THEY SEE</p>
                                </div>
                            }
                            gridSize={50}
                            pixelColor='black'
                            animationStepDuration={0.4}
                        />
                        
                        <div className="absolute top-6 right-6 z-30">
                            <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white/70">
                                &times;
                            </div>
                        </div>

                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-auto">
                            <div className="flex items-center gap-4 px-8 py-4 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl ring-1 ring-white/5">
                                
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'play' ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/50'}`}>
                                    <IconPlay />
                                </div>

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'person' ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/50'}`}>
                                    <IconPerson />
                                </div>

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'palette' ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/50'}`}>
                                    <IconPalette />
                                </div>

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'image' ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/50'}`}>
                                    <IconImage />
                                </div>

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'settings' ? 'bg-white text-black scale-110 shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/50'}`}>
                                    <IconSettings />
                                </div>

                                <div className="w-px h-8 bg-white/20 mx-1"></div>

                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${activeFeatureData.relatedIcon === 'obs' ? 'bg-[#10b981] text-white scale-110 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'text-white/50'}`}>
                                    <IconOBS />
                                </div>

                            </div>
                        </div>

                        <div className="absolute top-6 left-6 z-30 flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full border border-red-500/30">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE PREVIEW</span>
                        </div>

                    </div>
                </div>
            </div>
        </div> 
    );
});

export default SectionTwo;
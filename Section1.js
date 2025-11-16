import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiquidEther from '/Users/natalatomala/blr/blr/src/components/LiquidEther.js';

const SectionOne = React.forwardRef((props, ref) => {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const phoneY = useTransform(scrollYProgress, [0.5, 0.8], ["0%", "-50%"]);
    const phoneOpacity = useTransform(scrollYProgress, [0.5, 0.6], [0, 1]);
    const phoneRotate = useTransform(scrollYProgress, [0.5, 0.8], [0, 10]);

    const titleOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.2]); 
    const titleScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]); 

    return (
        <div ref={ref} className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
            
          <div className="absolute inset-0 z-0"> 
                <LiquidEther
                    colors={[ 'blue', '#ccd0cf', 'white']}
                    mouseForce={100}
                    cursorSize={150}
                    isViscous={false}
                    viscous={30}
                    iterationsViscous={32}
                    iterationsPoisson={32}
                    resolution={0.5}
                    isBounce={false}
                    autoDemo={true}
                    autoSpeed={0.5}
                    autoIntensity={2.2}
                    takeoverDuration={0.25}
                    autoResumeDelay={3000}
                    autoRampDuration={0.6}
                />
            </div>

          <motion.div
                className="relative z-10 p-4 text-center pointer-events-none" // pointer-events-none so cursor interaction hits the LiquidEther canvas
                style={{ opacity: titleOpacity, scale: titleScale }}
            >
                <h1 className="text-white text-[40vw] md:text-[15vw] lg:text-[10vw] font-extrabold leading-none tracking-tight drop-shadow-lg [text-shadow:0_0_10px_rgba(0,0,0,0.5)]">
                    BLRRD
                </h1>
                <p className="text-white/80 text-lg md:text-xl mt-4 max-w-xl mx-auto">
                    Blur the background. Focus on whats important. 
                </p>
              
            
            </motion.div>

        <motion.div
                className="absolute w-64 h-[28rem] bg-white rounded-[2rem] shadow-xl border-4 border-black z-20"
                style={{ y: phoneY, opacity: phoneOpacity, rotate: phoneRotate }}
            >
                <p className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-60 text-center text-sm font-light text-black opacity-50 whitespace-nowrap"> MOBILE SOON </p>
            </motion.div>
            
        </div> 
    );
});

export default SectionOne;
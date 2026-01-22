import React from 'react';
import { useScroll } from 'framer-motion';
import FlowingMenu from './components/FlowingMenu';
import pic from './pic.jpg';
const SectionThree = React.forwardRef((props, ref) => {
const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });
//mozna tu dodac obrazki jkbc
const demoItems = [
        { link: '#', text: 'BLUR', image: pic },
        { link: '#', text: 'PERSONALIZE', image: pic },
        { link: '#', text: 'FOCUS', image: pic },
        { link: '#', text: 'INTERACT', image: pic }
        ];
    
 const [activeFeature, setActiveFeature] = React.useState('FEATURE1');

    return (

      <div ref={ref} className="h-full w-full bg-gray-100 flex justify-center p-4 md:p-12">
  
  <div style={{ height: '600px', width:'100%', position: 'relative' }}>
        <FlowingMenu items={demoItems} />
  </div>
      
        </div>
    );
});

export default SectionThree;
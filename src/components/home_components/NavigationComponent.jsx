import React from 'react';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';
import axios from "axios";
import Stories from './Stories';
import ErrorBoundary from './ErrorBoundary';
import './NavigationCmpntStyle.css'
import { MyContext } from '../../MyContext';
import { useContext } from "react";
import Your_stories from './Your_stories';

const NavigationComponent = () => {
 
  const categories = ['food', 'sports' , 'news' , 'plants'];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const {isLogIn , setLogin} = useContext(MyContext);
  
  const handleSectionNavigation = (to) => {
    const sectionElement = document.getElementById(to);
    if (sectionElement) {
      const offset = sectionElement.offsetTop - 80; // Adjust the offset based on your header height
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };
  
  

    
   
  
  return (
    <div>
    
      <div className='navigation-btn-group'>
        <div id='nav-btn'  onClick={()=>{ handleSectionNavigation(`section${0}`);setSelectedCategory("All")  }}  className={selectedCategory == "All" ? "selected" : "not-selected"}
           > All </div>
        <div id='nav-btn' onClick={()=>{ handleSectionNavigation(`section${1}`);setSelectedCategory("Food")  }}  className={selectedCategory == "Food" ? "selected" : "not-selected"}
          > Food </div>
        <div id='nav-btn' onClick={()=>{ handleSectionNavigation(`section${2}`);setSelectedCategory("Sports")  }} className={selectedCategory == "Sports" ? "selected" : "not-selected"}
          > Sports </div>
        <div id='nav-btn' onClick={()=>{ handleSectionNavigation(`section${3}`);setSelectedCategory("News")  }} className={selectedCategory == "News" ? "selected" : "not-selected"}
          > News </div>
        <div id='nav-btn' onClick={()=>{ handleSectionNavigation(`section${4}`);setSelectedCategory("Plants")  }} className={selectedCategory == "Plants" ? "selected" : "not-selected"}
           > Plants </div>


      </div> 

    {
      (isLogIn)&&(
        <div>
          <h4 style={{textAlign:'center'}}> Your stories</h4>
           <Your_stories/>
        </div>
       
      )
    }
        
      {categories.map((category, index) => (
        
       
        <div key={index} style={{ height: 'auto', marginTop: '20px' }} id={`section${index + 1}`}  >
          <h3 style={{textAlign:'center'}}> Top stories about {category}</h3>
         
          <ErrorBoundary>
            
                <Stories category ={category} />
            
         
          </ErrorBoundary>
        </div>
      ))}
    </div>
  );
};

export default NavigationComponent;

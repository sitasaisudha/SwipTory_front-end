import { MyContext } from "./MyContext"; //using context api
import { Route , Routes } from 'react-router-dom'; //importing react router dom
import { useState } from 'react';
import React from 'react';
import SignIn from "./components/home_components/SignIn";
import './App.css'
import Navbar from "./components/home_components/Navbar";

import NavigationComponent from "./components/home_components/NavigationComponent";
// import SlideEditor from "./components/SlideForm";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import Stories from "./components/home_components/Stories";
import Hi from "./components/Hi";
import SlideEditor from "./components/Edit";
import Your_stories from "./components/home_components/Your_stories";
// import SlideEditEditor from "./components/home_components/EditSlides";

function App() {
  const [isLogIn , setLogin] = useState(false) // variable to store wheather user loggrd in or not
  const [text, setText] = useState(false) //variable to open and close the pop up
  const [register, setRegister] = useState(true);// used to switch between register and login
  const [storyId ,setStoryId] = useState("")
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const[msg,setMsg] = useState("Register to SwipTory")
  return (
    <div className="App">
     
    
      <MyContext.Provider value={{ text, setText , isLogIn , setLogin, register, setRegister , msg, setMsg , storyId ,setStoryId,modalIsOpen, setModalIsOpen}}>
       <Routes>
          <Route  path="/" element={  <Home/>} />
          <Route path="/bookmarks" element={ <Bookmarks/>} />
         
          </Routes>  
        
   
     

     {/* <SlideEditor id='64b2a9728c8b9c8bc2a19d83' /> */}
     </MyContext.Provider>
    </div>

  );
}

export default App;

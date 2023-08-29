import { MyContext } from "./MyContext"; //using context api
import { Route, Routes } from "react-router-dom"; //importing react router dom
import { useState } from "react";
import React from "react";
import "./App.css";
import Home from "./pages/Home";
import Bookmarks from "./pages/Bookmarks";
import Shares from "./pages/Shares";

function App() {
  const [isLogIn, setLogin] = useState(false); // variable to store wheather user loggrd in or not
  const [text, setText] = useState(false); //variable to open and close the pop up
  const [register, setRegister] = useState(true); // used to switch between register and login
  const [storyId, setStoryId] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [EditmodalIsOpen, setEditModalIsOpen] = useState(false);
  const [msg, setMsg] = useState("Register to SwipTory");
  const [user_id, setUser_id] = useState("");
  return (
    <div className="App">
      <MyContext.Provider
        value={{
          text,
          setText,
          isLogIn,
          setLogin,
          register,
          setRegister,
          msg,
          setMsg,
          storyId,
          setStoryId,
          modalIsOpen,
          setModalIsOpen,
          EditmodalIsOpen,
          setEditModalIsOpen,
          user_id,
          setUser_id,
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/carousel" element={<Shares />} />
        </Routes>
      </MyContext.Provider>
    </div>
  );
}

export default App;

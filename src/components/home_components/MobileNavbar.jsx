import React from "react";
import "./NavbarStyles.css";
import { MyContext } from "../../MyContext"; // importing my context to use context variables
import { useContext } from "react"; //using context api
import { useState } from "react"; // importing use state hook
import axios from "axios";
import { useNavigate } from "react-router-dom";

import baseUrl from ".././../constants/Base";
const MobileNavbar = () => {
  const navigate = useNavigate();
  const { text, setText } = useContext(MyContext); // used to handel display of popus
  const { register, setRegister } = useContext(MyContext);

  const { msg, setMsg } = useContext(MyContext); //used to display empty fields message
  const { modalIsOpen, setModalIsOpen } = useContext(MyContext); // to display modal for adding a story
  const [logout, setLogout] = useState(false);
  const { isLogIn, setLogin } = useContext(MyContext);
  const { storyId, setStoryId } = useContext(MyContext);
  const name = localStorage.getItem("name");
  const [showMobile, setShowMobile] = useState(false);
  const handelAddStory = () => {
    axios
      .post(`${baseUrl}/api/addStory`, {})
      .then((res) => {
        setStoryId(res.data);
      })
      .catch((err) => console.log(err));
    console.log("added");
    setModalIsOpen(true);
  };
  const logoutHeader = () => {
    setLogin(false);
    setLogout(true);
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    localStorage.removeItem("bookmarkedSlides");
  };
  return (
    <div>
      <div className="navbar">
        <span>SwipTory</span>
        <i
          className="ri-menu-line"
          onClick={() => {
            setShowMobile(true);
          }}
        ></i>
      </div>

      {showMobile && !name ? (
        <div className="mobile-show-buttons">
          <div
            className="mobile-into"
            onClick={() => {
              setShowMobile(false);
            }}
          >
            x
          </div>
          <button
            className="loggedin-register-button"
            onClick={() => {
              setRegister(true);
              setText(true);
              setMsg("Register to SwipTory");
            }}
          >
            Register
          </button>
          <br></br>
          <button
            className="loggedin-register-button"
            onClick={() => {
              setRegister(false);
              setText(true);
              setMsg("Login to SwipTory");
            }}
          >
            Login
          </button>
        </div>
      ) : (
        ""
      )}

      {showMobile && name ? (
        <div className="mobile-show-buttons">
          <span
            className="mobile-into"
            onClick={() => {
              setShowMobile(false);
            }}
          >
            X
          </span>
          <div className="mobileview-profile">
            <span>{name}</span>
          </div>

          <button className="loggedin-register-button">Your Story</button>
          <br></br>
          <button
            className="loggedin-register-button"
            onClick={() => {
              // logoutHeader();
              handelAddStory();
            }}
          >
            Add Story
          </button>
          <br></br>
          <button
            className="loggedin-register-button"
            onClick={() => navigate("/bookmarks")}
          >
            {" "}
            <i className="ri-bookmark-fill"></i> Bookmarks
          </button>
          <br></br>
          <button
            className="loggedin-register-button"
            onClick={() => {
              logoutHeader();
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default MobileNavbar;

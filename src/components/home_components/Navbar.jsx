import React from "react";
import "./NavbarStyles.css";
import { MyContext } from "../../MyContext"; // importing my context to use context variables
import { useContext } from "react"; //using context api
import { useState } from "react"; // importing use state hook
import { useNavigate } from "react-router-dom";
import baseUrl from '.././../constants/Base'
import axios from "axios";
const Navbar = () => {
  const navigate = useNavigate();
  const { text, setText } = useContext(MyContext); // used to handel display of popus
  const { register, setRegister } = useContext(MyContext);
  const { msg, setMsg } = useContext(MyContext); //used to display empty fields message
  const { modalIsOpen, setModalIsOpen } = useContext(MyContext); // to display modal for adding a story
  const [logout, setLogout] = useState(false);
  const name = localStorage.getItem("name");
  //    const isLogin = localStorage.getItem("name")
  const { isLogIn, setLogin } = useContext(MyContext);
  const { storyId, setStoryId } = useContext(MyContext);
  const headers = { token: localStorage.getItem("token") };
  

  const handelAddStory = () => {

    axios
      .post(`${baseUrl}/api/addStory`, {
        user_name: name,
      } ,  { headers: headers } )
      .then((res) => {
        setStoryId(res.data);
      })
      .catch((err) => console.log(err));
    console.log("added");
  };
  return (
    <>
      <div className="navigation-bar">
        <p className="nav-head">SwipTory </p>
      
        {name  ? (
          <div className="nav-items">
            <p
              className="nav-btn1"
              id="btns"
              onClick={() => navigate("/bookmarks")}
            >
              {" "}
              <i className="ri-bookmark-line"></i>Bookmarks{" "}
            </p>

            <p
              className="nav-btn1"
              id="btns"
              onClick={() => {
                handelAddStory();
                setModalIsOpen(true);
              }}
            >
              {" "}
              Add story{" "}
            </p>
              
            <img />
            <p className="nav-btn-toggle" onClick={() => setLogout(true)}>
              {" "}
              <i className="ri-menu-line"></i>{" "}
            </p>
          </div>
        ) : (
          <div className="nav-items">
            <input
              type="button"
              value="Login"
              className="nav-btn1"
              id="btn1"
              onClick={() => {
                setRegister(false);
                setText(true);
                setMsg("Login to SwipTory");
              }}
            />
            <input
              type="button"
              value="Register"
              className="nav-btn1"
              id="btn2"
              onClick={() => {
                setRegister(true);
                setText(true);
                setMsg("Register to SwipTory");
              }}
            />
          </div>
        )}
      </div>
      {logout ? (
        <div className="logout">
          <p  onClick={()=> {setLogout(false);}} style={{float:'right'}} >X</p>
          <p> {name} </p>
          <button
            onClick={() => {
              setLogin(false);
              setLogout(false);
              localStorage.removeItem("name");
              localStorage.removeItem("token");
              localStorage.removeItem("bookmarkedSlides");
            }}
          >
            Logout
          </button>
            

        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default Navbar;

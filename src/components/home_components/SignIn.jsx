// form to sign In and register

import React from "react";
import "./SignInStyle.css";
import { MyContext } from "../../MyContext"; // importing my context to use context variables
import { useContext } from "react"; //using context api
import { useState } from "react"; // importing use state hook
import axios from "axios"; // importing axios
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import baseUrl from '.././../constants/Base'
const SignIn = () => {
  const { text, setText } = useContext(MyContext); // used to handel display of popus
  const { isLogIn, setLogin } = useContext(MyContext);
  const { msg, setMsg } = useContext(MyContext); //used to display empty fields message
  const { register, setRegister } = useContext(MyContext); // used to switch between register and login

  const showToastSuccessMessage = () => {
    toast.success("Logged in Successfully !", {
      position: toast.POSITION.TOP_CENTER,
    });
  }; // to show the Login  success toast message
  const showToastFailureMessage = () => {
    toast.error("Invalid Login !", {
      position: toast.POSITION.TOP_CENTER,
    }); // to show invalid login toast message
  };
  const showToastREgisterFailureMessage = () => {
    toast.error("Enter Fields properly !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };// to show register failure message 
  const showToastREgisterSuccessMessage = () => {
    toast.success("REgister  Successfull! !", {
      position: toast.POSITION.TOP_CENTER,
    });
  };

  const [formValues, setFromValues] = useState({
    username: "",
    pass_word: "",
  }); //to storethe users values

  const handleChange = (e) => {
    setFromValues({ ...formValues, [e.target.name]: e.target.value });
  }; // to store the values enterd by user
  const [nameError, setNameError] = useState(false);
  const [passError, setPassError] = useState(false);
  const [invalidMsg, setInvalidMsg] = useState(""); // used to display inavlid username message
  const handleSubmit = (e) => {
    let valid = true;
    if (!(formValues.username.length > 0)) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }
    if (!(formValues.pass_word.length > 0)) {
      setPassError(true);
      valid = false;
    } else {
      setPassError(false);
    }

    if (!valid) {
      showToastFailureMessage();
      setMsg("please fill the fileds correctly");
    }

    if (valid) {
      if (register) {
        axios
          .post(`${baseUrl}/api/register`, {
            username: formValues.username,

            pass_word: formValues.pass_word,
          })
          .then((response) => {
            // setLogin(divue);
            console.log(response.data);
            if (response.data.username) {
              localStorage.setItem("name", response.data.username);
              localStorage.setItem("token", response.data.token);

              console.log(response.data);
              setLogin(true);
              setInvalidMsg("");
              setText(false);
              showToastREgisterSuccessMessage();
            } else {
              setInvalidMsg("please enter valid username");
              showToastREgisterFailureMessage();
            }

            // navigate("/");
          });
      } else {
        axios
          .post(`${baseUrl}/api/login`, {
            username: formValues.username,

            pass_word: formValues.pass_word,
          })
          .then((response) => {
            // setLogin(divue);
            console.log(response.data);
            if (response.data.username) {
              localStorage.setItem("name", response.data.username);
              localStorage.setItem("token", response.data.token);

              console.log(response.data);
              setLogin(true);
              setText(false);
              showToastSuccessMessage();
            } else {
              setInvalidMsg("please enter valid username");
              showToastFailureMessage();
            }
          });
      }
    }
  };

  if (!text) {
    return null;
  }

  return (
    <div className="modal">
      <div className="SignIn-body">
        <p className="float-into-icon" onClick={() => setText(false)}>
          {" "}
          <i className="ri-close-circle-line"></i>{" "}
        </p>
        <p className="heading"> {msg} </p>

        <div className="form">
          <div className="form-item">
            <div className="user-field-label">Username</div>
            <div className="user-fileld-input">
              <input
                onChange={(e) => handleChange(e)}
                className="input"
                type="text"
                name="username"
                placeholder="Username"
                value={formValues.username}
                style={{
                  border: nameError ? "2px solid red" : "2px solid black",
                }}
              />
            </div>
          </div>
          <div className="form-item">
            <div className="user-field-label">Password </div>
            <div>
              <input
                onChange={(e) => handleChange(e)}
                className="input"
                type="password"
                name="pass_word"
                placeholder="password"
                value={formValues.pass_word}
                style={{
                  border: nameError ? "2px solid red" : "2px solid black",
                }}
              />
            </div>
          </div>
        </div>

        {register && (
          <div>
            <p className="para">
              Already have an account?{" "}
              <input
                type="button"
                value="Sign In"
                className="link-button"
                onClick={() => {
                  setRegister(false);
                  setMsg("Login to SwipTory");
                }}
              />
            </p>
            <input
              type="button"
              className="form-button"
              value="Register"
              onClick={(e) => handleSubmit(e)}
            />
          </div>
        )}
        {!register && (
          <div>
            <p className="para">
              Don't have an account?{" "}
              <input
                type="button"
                value="Sign Up"
                className="link-button"
                onClick={() => {
                  setRegister(true);
                  setMsg("Login to SwipTory");
                }}
              />
            </p>
            <input
              type="button"
              className="form-button"
              value="Sign In"
              onClick={(e) => {
                handleSubmit(e);
              }}
            />
          </div>
        )}
        <p className="error-msg"> {invalidMsg} </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SignIn;

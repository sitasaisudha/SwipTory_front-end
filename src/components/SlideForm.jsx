// Adding slides

import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./SlideFormStyles.css";
import { useContext } from "react"; //using context api
import { MyContext } from "../MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMediaQuery } from "react-responsive";
import baseUrl from '../constants/Base'

Modal.setAppElement("#root");
const showToastSuccessMessage = () => {
  toast.success("Added Successfully !", {
    position: toast.POSITION.TOP_CENTER,
  });
};
const showToastWarningMessage = () => {
  toast.warning("Add atleast 3 slides and close !", {
    position: toast.POSITION.TOP_CENTER,
  });
};
const showToastFillMessage = () => {
  toast.warning("Fill all fileds properly !", {
    position: toast.POSITION.TOP_CENTER,
  });
};

const SlideForm = ({ index, slide, updateSlide }) => {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
  const handleChange = (event) => {
    const { name, value } = event.target;
    updateSlide(index, { ...slide, [name]: value });
  };

  return (
    <div className="slide-form">
      {isDesktopOrLaptop ? (
        <table style={{ border: "none" }}>
          <thead></thead>
          <tbody>
            <tr>
              <td> Heading:</td>
              <td>
                {" "}
                <input type="text" name="heading" onChange={handleChange} />
              </td>
            </tr>
            <br />
            <tr>
              <td> Description:</td>
              <td>
                {" "}
                <textarea name="description" onChange={handleChange} />
              </td>
            </tr>
            <br />
            
            <tr>
              <td> Image URL:</td>
              <td>
                {" "}
                <input
                  type="text"
                  name="image_url"
                  onChange={handleChange}
                />{" "}
              </td>
            </tr>
            <br />
            <tr>
              {" "}
              <td>Categories:</td>
              <td>
                <select name="categories" onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="food">Food</option>
                  <option value="news">News</option>
                  <option value="sports">Sports</option>
                  <option value="plants">Plants</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      ) : (
        <div className="formic-comp">
          <label>
            Heading:
            </label>
            <input
              type="text"
              name="heading"
            
              onChange={handleChange}
            />
        
          <br />
          <label>
            Description:
            </label>
            <textarea
              name="description"
            
              onChange={handleChange}
            />
         
          <br />
          <label>
            Image URL:
            </label>
            <input
              type="text"
              name="image_url"
            
              onChange={handleChange}
            />
         
          <br />
          <label>
            Categories:
            </label>
            <select
              name="categories"
             
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="news">News</option>
              <option value="sports">Sports</option>
              <option value="sports">Plants</option>
            </select>
         
        </div>
      )}
    </div>
  );
};

const SlideEditor = () => {
  // const [sldIndx , setSldIndx] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const { modalIsOpen, setModalIsOpen } = useContext(MyContext);
  const { storyId, setStoryId } = useContext(MyContext);
  const [slides, setSlides] = useState([
    { heading: "", description: "", image_url: "", categories: "" },
    { heading: "", description: "", image_url: "", categories: "" },
    { heading: "", description: "", image_url: "", categories: "" },
    { heading: "", description: "", image_url: "", categories: "" },
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [postSlideCount, setPostSlideCount] = useState(0);

  const addSlide = () => {
    setSlides([
      ...slides,
      { heading: "", description: "", image_url: "", categories: "" },
    ]);
    setCurrentSlide(slides.length); // Set current slide to the newly added slide
  };

  const updateSlide = (index, updatedSlide) => {
    setSlides((prevSlides) => {
      const newSlides = [...prevSlides];
      newSlides[index] = updatedSlide;
      return newSlides;
    });
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setActiveSlide(index);

    console.log(currentSlide);
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setActiveSlide(currentSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setActiveSlide(currentSlide + 1);
    }
  };

  const handleCloseModal = () => {
    if (postSlideCount <= 3) {
      alert("Submit at least 3 slides");
    } else {
      setModalIsOpen(false);
    }
  };
  const headers = { token: localStorage.getItem("token") };

  const handlePostSlide = () => {
    axios
      .post(`${baseUrl}/api/addSlide`, {
        heading: slides[currentSlide].heading,
        description: slides[currentSlide].description,
        image_url: slides[currentSlide].image_url,
        categories: slides[currentSlide].categories,
        story_id: storyId,
      } ,
      { headers: headers }
      )
      .then((res) => {
        showToastSuccessMessage();
        console.log(res);
      })
      .catch((err) =>{
      showToastFillMessage(); console.log(err)});
    console.log(
      "Added a slide:",
      slides[currentSlide].heading,
      typeof slides[currentSlide]
    );
    setPostSlideCount((prevCount) => prevCount + 1);
  };

  return (
    <div className="models">
      <Modal
        className="addSlidemodal"
        overlayClassName="slide-modal-overlay"
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Slide Editor Modal"
        appElement={document.getElementById("root")}
      >
        <button
          className="close-button"
          onClick={()=>{if(postSlideCount <=3){
            showToastWarningMessage();
          }else{
            handleCloseModal()
          }
        }}
        
        
        >
          <i className="ri-close-circle-line"></i>
        </button>
        <br></br>
        <p className="slide-para">Add up to six slides</p>
        <div className="slide-btn-container">
             <div className = {`slide-button-group ${slides.length>4 ?'aftr':""}`}>
          {slides.map((_, index) => (
          
            <button
              key={index}
              style={{alignContent:'center'}}
              onClick={() => goToSlide(index)}
              className={`slide-btns ${activeSlide === index ? "active" : ""}`}
            >
              <b>  Slide {index + 1} </b>
            
            </button>
          ))}
          <button
            onClick={addSlide}
            className="slide-btns"
            disabled={slides.length >= 6}
          >
            Add +
          </button>
        </div>
        <div>
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{ display: index === currentSlide ? "block" : "none" }}
            >
              <SlideForm
                index={index}
                slide={slide}
                updateSlide={updateSlide}
              />
            </div>
          ))}
        </div>
        </div>
        {/* <br /> */}
        <div className="form-buttons">
          <button onClick={goToPreviousSlide} className="prev-btn">
            Previous Slide
          </button>
          <button onClick={goToNextSlide} className="next-btn">
            Next Slide
          </button>

          <button onClick={handlePostSlide} className="post-btn">
            Post Slide
          </button>
        </div>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default SlideEditor;

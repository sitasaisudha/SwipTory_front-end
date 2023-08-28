import React, { useEffect, useState } from 'react';
import axios from "axios";
import baseUrl from ".././../constants/Base";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { MyContext } from "../../MyContext";
import Modal from "react-modal";
import './Share.css'
Modal.setAppElement("#root");

const SharedSlidesPage = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const i_d = localStorage.getItem("id");
  const [shareStory, setSharedStory] = useState([])
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  useEffect(() => {
    
    axios
      .get(`${baseUrl}/api/slide/?id=${i_d}`)
      .then((res) => {
        // setBookSlides(res.data);
        console.log(res.data)
        setSharedStory(res.data);
        
      })
      .catch((err) => console.log('erroe',err));
     
  }, []);
  const handleSlideChange = (index) => {
    setSelectedSlideIndex(index);
  };
  const handlePreviousSlide = () => {
   
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
     
      setSelectedSlideIndex(shareStory.length -1);
     
     
    }
  
  };

  const handleNextSlide = () => {
  
    if (selectedSlideIndex < shareStory.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
      console.log(selectedSlideIndex);
    } else {
      
      setSelectedSlideIndex(0);
    

     
    }
    
  
  };
 
  const renderCustomIndicators = () => {
    return shareStory.map((_, index) => (
      <div
        key={index}
        className={`share-custom-indicator ${selectedSlideIndex === index ? 'active' : ''}`}
        style={{
          
         width:'50px',
          height: '5px',    // Height of the lines
        
        
        }}
       
      />
    ));
  };
 

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={()=>setModalOpen(false)}
        className="your-modal"
        overlayClassName="custom-modal-overlay"

      >
        <div className ='modal-share'> 
        <div className="share-custom-indicators-container">{renderCustomIndicators()}</div>
        <Carousel
         
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          className="modal-your-carousel-wrapper"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
             (
              <button
                onClick={()=>handlePreviousSlide()}
                title={label}
                className="carousel-arrow carousel-arrow-prev"
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            (
              <button
                onClick={()=>handleNextSlide()}
                title={label}
                className="carousel-arrow carousel-arrow-next"
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            )
          }
        >
          {shareStory.map((slide, index) => (
            <div key={index} className="mod-slide-wrapper">
              <img src={slide.image_url} alt={slide.heading} />
              <div className="slide-content">
                <h3>{slide.heading}</h3>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </Carousel>
        </div>
      
      </Modal>
    </div>
  );
};

export default SharedSlidesPage;
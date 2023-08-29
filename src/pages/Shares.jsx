// when shared a story it appers in this page

import React, { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "./../constants/Base";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import Modal from "react-modal";
import "./Share.css";
import { MyContext } from "../MyContext";
Modal.setAppElement("#root");

const Shares = () => {
  const [modalOpen, setModalOpen] = useState(true);
  const i_d = localStorage.getItem("id");
  const [shareStory, setSharedStory] = useState([]);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  useEffect(() => {
    axios
      .get(`${baseUrl}/api/slide/?id=${i_d}`)
      .then((res) => {
        console.log(res.data);
        setSharedStory(res.data);
      })
      .catch((err) => console.log("erroe", err));
  }, []);
  const handleSlideChange = (index) => {
    setSelectedSlideIndex(index);
  };
  const handlePreviousSlide = () => {
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
      setSelectedSlideIndex(shareStory.length - 1);
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

  return (
    <div>
      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        className="your-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-share">
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={true}
            className="share-modal-your-carousel-wrapper"
            renderArrowPrev={(onClickHandler, hasPrev, label) => (
              <button
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-prev"
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
            )}
            renderArrowNext={(onClickHandler, hasNext, label) => (
              <button
                // onClick={()=>handleNextSlide()}
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-next"
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            )}
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

export default Shares;

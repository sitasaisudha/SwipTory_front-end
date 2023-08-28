import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./Your_stories.Styles.css";
import Modal from "react-modal";
import SlideEditor from "../Edit";
import { MyContext } from "../../MyContext";
import { useContext } from "react";
import baseUrl from ".././../constants/Base";


Modal.setAppElement("#root");

const Your_stories = () => {
  const { EditmodalIsOpen, setEditModalIsOpen } = useContext(MyContext);

  const [your_stories, setYour_stories] = useState([]);
  const [slidesData, setSlidesData] = useState({}); // Separate state for storing slides data
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStorySlides, setSelectedStorySlides] = useState([]);
  const name = localStorage.getItem("name");
  const [error, setError] = useState(null);
  const [edit_id, setEdit_id] = useState(0);
  const headers = { token: localStorage.getItem("token") };
  const [share, setShare] = useState(false);

  useEffect(() => {
    // to fetch the your stories 
    axios
      .get(`${baseUrl}/api/yourStories/?name=${name}`, { headers: headers })
      .then((res) => {
        setYour_stories(res.data);
      })
      .catch((err) => {
        setError("Error fetching your_stories");
      });
  }, []);

  useEffect(() => {
    // Fetch slides data for each story_id in your_stories
    const fetchSlidesData = async () => {
      const slidesData = {};
      for (const story of your_stories) {
        try {
          const res = await axios.get(`${baseUrl}/api/slide?id=${story._id}`, { headers: headers });
          slidesData[story._id] = res.data;
        } catch (err) {
          console.log(`Error fetching slides for story_id ${story._id}:`, err);
          setError(`Error fetching slides for story_id ${story._id}`);
        }
      }
      setSlidesData(slidesData);
    };

    fetchSlidesData();
  }, [your_stories]);

  if (error) {
    return <div>Error: {error}</div>;
  }

 

  return (
    <div className="your_stories">
      {Object.entries(slidesData).map(([storyId, slides], index) => (
        <div key={index}>
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={false}
            showIndicators={false}
            className="your-carousel-wrapper"
          >
            {slides.map((slide) => (
              <div key={slide._id} className="your-slide-wrapper" 
              onClick={() => {
                setSelectedStorySlides(slides); // Set selected story's slides
                setModalOpen(true); // Open the modal
              }}
              >
                <img src={slide.image_url} alt={slide.heading} />
                <div className="your-slide-content">
                  <h3>{slide.heading}</h3>
                  <p>{slide.description}</p>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditModalIsOpen(true);
                      setEdit_id(slide.story_id);
                    }}
                  >
                    <i className="ri-edit-2-line"></i>
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </Carousel>
          {EditmodalIsOpen && <SlideEditor id={edit_id} />}
        </div>
      ))}

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Slides Modal"
        className="your-modal"
      >
        <Carousel
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          showIndicators={false}
          className="modal-your-carousel-wrapper"
          renderArrowPrev={(onClickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-prev"
              >
                <i className="ri-arrow-left-s-line"></i>
              </button>
            )
          }
          renderArrowNext={(onClickHandler, hasNext, label) =>
            hasNext && (
              <button
                onClick={onClickHandler}
                title={label}
                className="carousel-arrow carousel-arrow-next"
              >
                <i className="ri-arrow-right-s-line"></i>
              </button>
            )
          }
        >
          {selectedStorySlides.map((slide) => (
            <div key={slide._id} className="modal-your-slide-wrapper">
                <div className="slide-top-content">
              <button className="close-buttons" onClick={()=>setModalOpen(false)}>
                x
              </button>
              <button
                className="send-buttons"
                onClick={() => {
                  setShare(true);
                }}
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
              <img src={slide.image_url} alt={slide.heading} />
                <div className="your-slide-content">
                  
                  <h3>{slide.heading}</h3>
                  <p>{slide.description}</p>
                  {share ? (
                <div className="share-btn"> Link copied to Clipboard </div>
              ) : (
                ""
              )}
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditModalIsOpen(true);
                      setEdit_id(slide.story_id);
                    }}
                  >
                     <i className="ri-edit-2-line"></i>
                    Edit
                  </button>
                </div>
               
            </div>
          ))}
        </Carousel>
      </Modal>
    </div>
  );
};

export default Your_stories;

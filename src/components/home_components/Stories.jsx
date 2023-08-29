// displaying the stories and slides based on categories

import React, { useEffect, useState, useContext } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import Modal from "react-modal";
import "./SlideComp.css";
import baseUrl from ".././../constants/Base";
import SignIn from "./SignIn";
import { MyContext } from "../../MyContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const name = localStorage.getItem("name");
Modal.setAppElement("#root");

const toastMessage = () => {
  toast.warning("Login to proceed!", {
    position: toast.POSITION.TOP_CENTER,
  });
};

const Stories = ({ category }) => {
  const headers = { token: localStorage.getItem("token") };
  const { isLogIn, setLogin } = useContext(MyContext);
  const { text, setText } = useContext(MyContext);
  const { user_id, setUser_id } = useContext(MyContext);
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [share, setShare] = useState(false);

  useEffect(() => {
    const getUSerId = async () => {
      console.log("hi");
      try {
        const response = await axios.get(`${baseUrl}/api/user_id?name=${name}`);
        setUser_id(response.data);
        console.log(response.data, name); // This will log the updated user_id
      } catch (err) {
        console.log(err);
      }
    };
    getUSerId();

    axios
      .get(`${baseUrl}/api/slides?category=${category}`)
      .then((res) => {
        setSlides(res.data.slides);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [bookmarkedSlides, setBookmarkedSlides] = useState(() => {
    const savedBookmarkedSlides = localStorage.getItem("bookmarkedSlides");
    return savedBookmarkedSlides ? JSON.parse(savedBookmarkedSlides) : [];
  });

  useEffect(() => {
    // Save bookmarked slides to local storage whenever they change
    localStorage.setItem("bookmarkedSlides", JSON.stringify(bookmarkedSlides));
  }, [bookmarkedSlides]);

  // grouping the slides
  const groupedSlides = {};
  slides.forEach((slide) => {
    const { story_id } = slide;
    if (!groupedSlides[story_id]) {
      groupedSlides[story_id] = [];
    }
    groupedSlides[story_id].push(slide);
  });
  const [selectedSlides, setSelectedSlides] = useState([]);

  // when user click to share the story
  const handleShareClick = (id) => {
    let link = window.location.href + "carousel";
    localStorage.setItem("id", id);

    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard");
        console.log(localStorage.getItem("id"));
        setShare(true);
      })
      .catch((error) => {
        console.error("Failed to copy link to clipboard:", error);
      });
  };

  const handleSlideClick = (slides) => {
    setSelectedSlides(slides);
    setSelectedSlideIndex(0);
    setIsModalOpen(true);
  };

  // to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlides([]);
    setSelectedSlideIndex(0);
    setShare(false);
  };

  // to manage the bookmarks
  const handleBookmarkToggle = async (slideId) => {
    if (!name) {
      setText(true);
    } else {
      try {
        const isCurrentlyBookmarked = bookmarkedSlides.includes(slideId);
        if (isCurrentlyBookmarked) {
          const updatedBookmarkedSlides = bookmarkedSlides.filter(
            (id) => id !== slideId
          );
          setBookmarkedSlides(updatedBookmarkedSlides);
        } else {
          setBookmarkedSlides([...bookmarkedSlides, slideId]);
        }

        const response = await axios.post(
          `${baseUrl}/api/bookmarks`,
          {
            userId: user_id,
            slideId: slideId,
          },
          { headers: headers }
        );

        if (!response.data.success) {
          if (isCurrentlyBookmarked) {
            setBookmarkedSlides([...bookmarkedSlides, slideId]);
          } else {
            const updatedBookmarkedSlides = bookmarkedSlides.filter(
              (id) => id !== slideId
            );
            setBookmarkedSlides(updatedBookmarkedSlides);
          }
        }
      } catch (error) {
        console.error("Error toggling bookmark:", error);
      }
    }
  };

  // to go to previous slide
  const handlePreviousSlide = () => {
    setShare(false);
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
      const storyIds = Object.keys(groupedSlides);
      let p = selectedSlides[selectedSlideIndex].story_id;

      const currentIndex = storyIds.findIndex((id) => id === p.toString());

      const previousIndex =
        (currentIndex - 1 + storyIds.length) % storyIds.length;
      const previousStoryId = storyIds[previousIndex];
      setSelectedSlideIndex(groupedSlides[previousStoryId].length - 1);
      setSelectedSlides(groupedSlides[previousStoryId]);
    }
    console.log(selectedSlides[selectedSlideIndex].likes);

    setLikeCount(selectedSlides[selectedSlideIndex].likes);
  };

  // to go to next slide
  const handleNextSlide = () => {
    setShare(false);
    if (selectedSlideIndex < selectedSlides.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
      console.log(selectedSlideIndex);
    } else {
      console.log("no..!");
      const storyIds = Object.keys(groupedSlides);

      let p = selectedSlides[selectedSlideIndex].story_id;
      const currentIndex = storyIds.findIndex((id) => id === p.toString());

      const nextIndex = (currentIndex + 1) % storyIds.length;

      const nextStoryId = storyIds[nextIndex.toString()];
      setSelectedSlideIndex(0);
      setSelectedSlides(groupedSlides[nextStoryId]);
    }
  };
  const handleSlideChange = (index) => {
    setSelectedSlideIndex(index);
  };

  const renderCustomIndicators = () => {
    return selectedSlides.map((_, index) => (
      <div
        key={index}
        className={`custom-indicator ${
          selectedSlideIndex === index ? "active" : ""
        }`}
        style={{
          height: "5px",
        }}
        onClick={() => handleSlideChange(index)}
      />
    ));
  };

  const renderCarousel = () => {
    return (
      <div>
        <div className="custom-indicators-container">
          {renderCustomIndicators()}
        </div>

        <Carousel
          className="carousel"
          selectedItem={selectedSlideIndex}
          showThumbs={false}
          showStatus={false}
          showArrows={true}
          renderIndicator={() => null}
          renderArrowPrev={(onClickHandler, hasPrev) => (
            <button
              className="carousel-arrow carousel-arrow-prev"
              onClick={() => {
                onClickHandler();
                handlePreviousSlide();
              }}
            >
              <i className="ri-arrow-left-s-line"></i>
            </button>
          )}
          renderArrowNext={(onClickHandler, hasNext) => (
            <button
              className="carousel-arrow carousel-arrow-next"
              onClick={() => {
                handleNextSlide();
                onClickHandler();
              }}
            >
              <i className="ri-arrow-right-s-line"></i>
            </button>
          )}
        >
          {selectedSlides.map((slide) => (
            <div key={slide.id} className="mod-slide-wrapper">
              <img src={slide.image_url} alt={slide.heading} />

              <div className="slide-top-content">
                <button className="close-buttons" onClick={handleCloseModal}>
                  x
                </button>
                <button
                  className="send-buttons"
                  onClick={() => {
                    handleShareClick(slide.story_id);
                  }}
                >
                  <i className="ri-send-plane-fill"></i>
                </button>
              </div>
              <div className="slide-content">
                <h3>{slide.heading}</h3>
                <p>{slide.description}</p>
                {share ? (
                  <div className="share-btn"> Link copied to Clipboard </div>
                ) : (
                  ""
                )}
                <div className="bkmk-lk">
                  <button
                    onClick={() => handleBookmarkToggle(slide._id)}
                    className={`bookmark-button ${
                      bookmarkedSlides.includes(slide._id) ? "filled" : "fill"
                    }`}
                  >
                    <i
                      className={`ri-bookmark-${
                        bookmarkedSlides.includes(slide._id) ? "fill" : "line"
                      }`}
                    ></i>
                  </button>

                  <LikeButton slide={slide} user_id={user_id} />
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
  };

  const [showMore, setShowMore] = useState(false);

  const [visibleStories, setVisibleStories] = useState(4);
  const handleShowMoreClick = () => {
    if (showMore) {
      setVisibleStories(4); // Show 3 stories
    } else {
      setVisibleStories(Object.values(groupedSlides).length); // Show all stories
    }
    setShowMore(!showMore);
  };

  return (
    <div className="slide-container">
      {Object.values(groupedSlides)
        .slice(0, visibleStories)
        .map((slides, index) => (
          <div>
            <Carousel
              key={index}
              showThumbs={false}
              showIndicators={false}
              interval={0}
              className="custom-carousel"
            >
              <div
                key={slides[0].story_id}
                className="home-slide-wrapper"
                onClick={() => handleSlideClick(slides)}
              >
                <img src={slides[0].image_url} alt="image " />
                <div className="slide-content">
                  <h3>{slides[0].heading}</h3>
                  <p>{slides[0].description}</p>
                </div>
              </div>
            </Carousel>
          </div>
        ))}
      <div></div>
      <div className="show-more-button-container">
        <button className="show-more-button" onClick={handleShowMoreClick}>
          {showMore ? "Show Less" : "Show More"}
        </button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="slide-modal"
        overlayClassName="slide-modal-overlay"
      >
        {renderCarousel()}
        <button className="close-button" onClick={handleCloseModal}>
          Close Modal
        </button>
      </Modal>

      <SignIn />
      <ToastContainer />
    </div>
  );
};

const LikeButton = ({ slide, user_id }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(slide.likes);

  useEffect(() => {
    //to  Check if the user has already liked the slide

    setLiked(false);
  }, [user_id, slide._id]);
  const handleLikeToggle = () => {
    if (!user_id) {
      toastMessage();
    } else {
      const newLikedState = !liked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;
      const headers = { token: localStorage.getItem("token") };
      // Update the liked state and like count on the client side
      setLiked(newLikedState);
      setLikeCount(newLikeCount);
      axios.post(
        `${baseUrl}/api/likes`,
        {
          userId: user_id,
          slideId: slide._id,
          liked: newLikedState,
        },
        { headers: headers }
      );
    }
  };
  return (
    <button
      className={`like-button ${liked ? "liked" : ""}`}
      onClick={handleLikeToggle}
    >
      <i className={`ri-heart-${liked ? "fill" : "line"}`}></i>
      {likeCount}
    </button>
  );
};

export default Stories;

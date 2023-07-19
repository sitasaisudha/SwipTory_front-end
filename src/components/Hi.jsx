import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Modal from 'react-modal';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Hi.css';

const Hi = () => {
  const slides = [
    {
      id: 1,
      heading: 'Slide 1',
      description: 'This is slide 1',
      story_id: 1,
    },
    {
      id: 2,
      heading: 'Slide 2',
      description: 'This is slide 2',
      story_id: 1,
    },
    {
      id: 3,
      heading: 'Slide 3',
      description: 'This is slide 3',
      story_id: 2,
    },
    {
      id: 4,
      heading: 'Slide 4',
      description: 'This is slide 4',
      story_id: 2,
    },
    {
      id: 5,
      heading: 'Slide 5',
      description: 'This is slide 5',
      story_id: 3,
    },
    {
      id: 6,
      heading: 'Slide 6',
      description: 'This is slide 6',
      story_id: 3,
    },
  ];

  const groupedSlides = slides.reduce((groups, slide) => {
    const { story_id } = slide;
    if (!groups[story_id]) {
      groups[story_id] = [];
    }
    groups[story_id].push(slide);
    return groups;
  }, {});
  console.log(groupedSlides)

  const [selectedSlides, setSelectedSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const handleSlideClick = (slides) => {
    setSelectedSlides(slides);
    setSelectedSlideIndex(0);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSlides([]);
    setSelectedSlideIndex(0);
  };

  const handlePreviousSlide = () => {
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
      const storyIds = Object.keys(groupedSlides);
      let p =   selectedSlides[selectedSlideIndex].story_id;
      // const currentIndex = storyIds.findIndex(p.toString());
      const currentIndex = storyIds.findIndex((id) => id === p.toString());
     
      const previousIndex = (currentIndex - 1 + storyIds.length) % storyIds.length;
      const previousStoryId = storyIds[previousIndex];
      setSelectedSlides(groupedSlides[previousStoryId]);
      setSelectedSlideIndex(groupedSlides[previousStoryId].length - 1);
    }
  };

  const handleNextSlide = () => {
    if (selectedSlideIndex < selectedSlides.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
      console.log(selectedSlideIndex)
    } else {
      console.log('no..!')
      const storyIds = Object.keys(groupedSlides);
      // console.log(storyIds);
    let p =   selectedSlides[selectedSlideIndex].story_id
      const currentIndex = storyIds.findIndex((id) => id === p.toString());
      // console.log(currentIndex)
      const nextIndex = (currentIndex + 1) % storyIds.length;
      // console.log(nextIndex)
      const nextStoryId = storyIds[nextIndex.toString()];
      // console.log(nextStoryId)
      setSelectedSlides(groupedSlides[nextStoryId]);
      setSelectedSlideIndex(0);
    }
  };

  const renderCarousel = () => {
    return (
      <Carousel
        selectedItem={selectedSlideIndex}
        showThumbs={false}
        showStatus={false}
        showArrows={true}
       
        renderArrowPrev={(onClickHandler, hasPrev) =>
          (
            // <h1>prev</h1>
            <button className="carousel-arrow carousel-arrow-prev" onClick={handlePreviousSlide} style={{backgroundColor:'red'}} >
              Prev
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
         (
            <button className="carousel-arrow carousel-arrow-next" onClick={handleNextSlide}>
              Next
            </button>
          )
        }
      >
        {selectedSlides.map((slide) => (
          <div key={slide.id}   style={{backgroundColor :'green' , height:'400px' , width:'300px'}} >
            <h2>{slide.heading}</h2>
            <p>{slide.description}</p>
          </div>
        ))}
      </Carousel>
    );
  };

  return (
    <div className="carousel-container">
      {Object.values(groupedSlides).map((slides) => (
        <div key={slides[0].story_id} className="carousel-slide" onClick={() => handleSlideClick(slides)}>
          <h3>Story {slides[0].story_id}</h3>
          <p>{slides.length} slides</p>
        </div>
      ))}

      <Modal isOpen={isModalOpen} onRequestClose={handleModalClose} className="modal-content">
        {renderCarousel()}
        <button className="close-button" onClick={handleModalClose}>
          Close Modal
        </button>
      </Modal>
    </div>
  );
};

export default Hi;

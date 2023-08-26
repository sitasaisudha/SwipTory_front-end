import axios from 'axios';
import React from 'react';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { MyContext } from '../MyContext';
import './BookMarkStyles.css';
// import './CarouselStyles.css';
import baseUrl from './../constants/Base'

const Bookmarks = () => {
  const [bookList, SetBooksList] = useState([]);
  const [bookSlides, setBookSlides] = useState([]);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [share, setShare] = useState(false)
  const { user_id, setUser_id} = useContext(MyContext); 
  const headers = { token: localStorage.getItem("token") };

  useEffect(() => {
    console.log("user id :",user_id)
    axios
      .get(`http://localhost:4000/api/bookmarksSlides/?userId=${user_id}`,
      { headers: headers })
      .then((res) => {
        // setBookSlides(res.data);
      SetBooksList(res.data);

      })
      .catch((err) => console.log(err));
      setShare(false)
  }, []);
  useEffect(() => {
    const fetchSlideDetails = async () => {
      try {
        const slidesData = await Promise.all(
          bookList.map(async slideId => {
            const response = await axios.get(`http://localhost:4000/api/slideinfo/?id=${slideId}`);
            return response.data;
          })
        );
        setBookSlides(slidesData);
      } catch (error) {
        console.error('Error fetching slide details:', error);
      }
    };
    console.log(bookSlides)
    fetchSlideDetails();
  //  booksList.map((book)=>{
  //   axios
  //     .get(`http://localhost:4000/api/slideinfo/?id=${book}`)
  //     .then((res)=> setBookSlides() )
  //     .catch((err)=> console.log(err))
  //  })
  }, [bookList]);


  const handleSlideClick = (slide, index) => {
    setSelectedSlide(slide);
    setCurrentSlideIndex(index);
    setIsModalOpen(true);
  };

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : bookSlides.length - 1));
    console.log(currentSlideIndex)
    setSelectedSlide(bookSlides[currentSlideIndex])
    setShare(false)
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex < bookSlides.length - 1 ? prevIndex + 1 : 0));
    setSelectedSlide(bookSlides[currentSlideIndex])
    setShare(false)
  };

  const handleCloseModal = () => {
    setSelectedSlide(null);
    setCurrentSlideIndex(0);
    setIsModalOpen(false);
    setShare(false)
  };

  return (
    <div>
      <h1 style={{textAlign:'center'}} >Your bookmarks here</h1>
      <div className="book-mark-grp">
        {bookSlides.map((slide, index) => (
          <div key={slide.id} className="book-slide-wrapper" onClick={() => handleSlideClick(slide, index)}>
            <img src={slide.image_url} alt={slide.heading} />
            <div className="book-slide-content">
              <h3>{slide.heading}</h3>
              <p>{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* React Modal for Carousel */}
      <Modal isOpen={isModalOpen} onRequestClose={handleCloseModal} className='book-modal' overlayClassName="slide-modal-overlay" >
        <div className="book-carousel">
          <div className="book-carousel-slide">
            <img src={selectedSlide && selectedSlide.image_url} alt={selectedSlide && selectedSlide.heading} />
            <div className='book-slide-top-content'>
                 <button className="close-buttons" onClick={handleCloseModal} >
                      x
          </button>
          <button className="send-buttons" onClick={() =>{ setShare(true)}}  >
          <i className="ri-send-plane-fill"   ></i>
          </button>
                 </div>
                
            <div className="modal-book-slide-content">
              <h3>{selectedSlide && selectedSlide.heading}</h3>
              <p>{selectedSlide && selectedSlide.description}</p>
              {share? (<div className='share-btn'> Link copied to Clipboard </div>) :('')}
            </div>
          </div>
         <div className="carousel-btns">
        
         </div>
         
        </div>
      </Modal>
    </div>
  );
};

export default Bookmarks;

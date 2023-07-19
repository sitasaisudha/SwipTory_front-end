import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import axios from "axios";
import Modal from 'react-modal';
import './SlideComp.css'
Modal.setAppElement('#root'); // Set the app root element for the React Modal component

const Stories = ({category}) => {
    const [slides, setSlides] = useState([]);
   
   

    useEffect(()=>{
    axios
    .get(`http://localhost:4000/api/slides?category=${category}`,)
    .then((res)=> { setSlides(res.data.slides)}
    )
    .catch((err)=> {console.log(err)})
    },[]);

    const groupedSlides = {};
  slides.forEach((slide) => {
    const { story_id } = slide;
    if (!groupedSlides[story_id]) {
      groupedSlides[story_id] = [];
    }
    groupedSlides[story_id].push(slide);
  });
  const [selectedSlides, setSelectedSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

 
  const handleSlideClick = (slides) => {
    setSelectedSlides(slides);
    setSelectedSlideIndex(0);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlides([]);
    setSelectedSlideIndex(0);
    setShare(false)
  };
  const [bookmark, setBookmark] = useState(selectedSlides.length > 0 ? selectedSlides[0].bookmarks : false);
  const [likes, setLikes] = useState(false);
  const [likeCount, setLikeCount] = useState(selectedSlides.length > 0 ? selectedSlides[0].likes : 0)
  const [share, setShare] = useState(false)

  useEffect(() => {
    if (selectedSlides.length > 0) {
      setBookmark(selectedSlides[selectedSlideIndex].bookmarks);
      setLikes(false)
      setLikeCount(selectedSlides[selectedSlideIndex].likes)
    }
  }, []);
  
  const handleBookMark =(slide_id , slide_bookmarks)=>{
    console.log(slide_bookmarks)
    // setBookmark(!slide_bookmarks)
    console.log(slide_bookmarks)
    axios.patch(`http://localhost:4000/api/bookmarks`,{
      id : slide_id ,
      bookmarks : !slide_bookmarks
    }).then((res)=>setBookmark(res.data.bookmarks) ).catch((err)=> console.log(err)
    )
    
  }
  const [cnt, setCnt] = useState(0) // to allow user to only like once
  const handleLikes = (slide_id)=>{
    
    if(!likes && cnt == 0){
      setCnt(1)
      axios.patch(`http://localhost:4000/api/likes`,{
        id:slide_id
      }).then((response)=> setLikeCount(response.data.likes) ).catch((err)=> console.log(err))
      

    }
    else if(!likes ){
        setLikeCount(likeCount + 1);
    }
    else{
      setLikeCount(likeCount - 1)
    }
   setLikes(!likes)
  
   
  }

  const handlePreviousSlide = () => {
    setShare(false)
    if (selectedSlideIndex > 0) {
      setSelectedSlideIndex(selectedSlideIndex - 1);
    } else {
      const storyIds = Object.keys(groupedSlides);
      let p =   selectedSlides[selectedSlideIndex].story_id;
     
      const currentIndex = storyIds.findIndex((id) => id === p.toString());
     
      const previousIndex = (currentIndex - 1 + storyIds.length) % storyIds.length;
      const previousStoryId = storyIds[previousIndex];
      setSelectedSlideIndex(groupedSlides[previousStoryId].length - 1);
      setSelectedSlides(groupedSlides[previousStoryId]);
     
    }
  };

  const handleNextSlide = () => {
    setShare(false)
    if (selectedSlideIndex < selectedSlides.length - 1) {
      setSelectedSlideIndex(selectedSlideIndex + 1);
      console.log(selectedSlideIndex)
    } else {
      console.log('no..!')
      const storyIds = Object.keys(groupedSlides);
   
    let p =   selectedSlides[selectedSlideIndex].story_id
      const currentIndex = storyIds.findIndex((id) => id === p.toString());
      
      const nextIndex = (currentIndex + 1) % storyIds.length;
     
      const nextStoryId = storyIds[nextIndex.toString()];
      setSelectedSlideIndex(0);
      setSelectedSlides(groupedSlides[nextStoryId]);
     
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
           
            <button className="carousel-arrow carousel-arrow-prev" onClick={handlePreviousSlide}  >
              <i className="ri-arrow-left-s-line"></i>
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext) =>
         (
            <button className="carousel-arrow carousel-arrow-next" onClick={handleNextSlide} >
             <i className="ri-arrow-right-s-line"></i>
            </button>
          )
        }
      >
        {selectedSlides.map((slide) =>(
          
          <div  key={slide.id} className="slide-wrapper">
           
           <img src={slide.image_url} alt={slide.heading} />
           <div className='slide-top-content'>
                 <button className="close-buttons" onClick={handleCloseModal} >
                      x
          </button>
          <button className="send-buttons" onClick={() =>{ setShare(true)}}  >
          <i className="ri-send-plane-fill"   ></i>
          </button>
                 </div>
           <div className="slide-content">

             <h3>{slide.heading}</h3>
             <p>{slide.description}</p>
            {share? (<div className='share-btn'> Link copied to Clipboard </div>) :('')}
             <div className='bkmk-lk'>
             <button onClick={()=>{ handleBookMark(slide._id , bookmark) }} className={`bookmark-button ${bookmark ? 'filled' : ''}`} ><i className={`ri-bookmark-${bookmark ? 'fill' : 'line'}`}></i></button>
             <button className='like' onClick={()=> {handleLikes(slide._id)}} > <i className={`ri-heart-${likes ?'fill':'line'}`}>{likeCount}</i><span></span> </button>
          
             </div>
            
         </div>
         </div>
         ))
        
      }
      </Carousel>
    );
  };

  return (
    <div className="slide-container">
      {Object.values(groupedSlides).map((slides , index) => (
        
        <Carousel
          key={index}
          showThumbs={false}
          showIndicators={false}
         
          interval={0}
          // onClickItem={()=> handleSlideClick()}
          
          className="custom-carousel"
        >
       
         
          <div key={slides[0].story_id} style={{border:'3px solid black'}} className="slide-wrapper" onClick={() => handleSlideClick(slides)}>
          <img src={slides[0].image_url} alt='image ' />
         
           <div className="slide-content">

                <h3>{slides[0].heading}</h3>
                <p>{slides[0].description}</p>
                
              </div>
            </div>
      
         
        </Carousel>
      ))}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
        className="slide-modal"
        overlayClassName="slide-modal-overlay"
      >
        {renderCarousel()}
       
      <button className="close-button" onClick={handleCloseModal}> Close Modal  </button>
      

         
      </Modal>
    </div>
  );

    
};

export default Stories;
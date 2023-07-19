import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './Your_stories.Styles.css';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SlideEditor from '../Edit';
import { MyContext } from '../../MyContext';
import { useContext } from "react"; //using context api
Modal.setAppElement('#root');

const Your_stories = () => {
const {modalIsOpen, setModalIsOpen} = useContext(MyContext)

  const [your_stories, setYour_stories] = useState([]);
  const [slidesData, setSlidesData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState(null);

  const name = localStorage.getItem('name');
  const [error, setError] = useState(null);
 
  const [edit_id , setEdit_id] = useState(0)

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/yourStories/?name=${name}`)
      .then((res) => {
        setYour_stories(res.data);
      })
      .catch((err) => {
        console.log(err);
        setError('Error fetching your_stories');
      });
  }, [name]);

  useEffect(() => {
    // Fetch slides data for each story_id in your_stories
    const fetchSlidesData = async () => {
      const slidesData = {};
      for (const story of your_stories) {
        try {
          const res = await axios.get(`http://localhost:4000/api/slide?id=${story._id}`);
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
  
  const handleOnCLick=(story_id)=>{
    console.log('clicked')
   
    
  }
  return (
    <div className='your_stories'>
      
      {Object.values(slidesData).map((slides, index) => (
        <div key={index}>
          <Carousel
            showThumbs={false}
            showStatus={false}
            showArrows={true}
            showIndicators={false}
            className='your-carousel-wrapper'
          
          >
            {slides.map((slide) => (
              <div key={slide._id} className='your-slide-wrapper'>
                <img src={slide.image_url} alt={slide.heading} />
                <div className='your-slide-content'>
                  <h3>{slide.heading}</h3>
                  <p>{slide.description}</p>
                  <button className='edit-btn' onClick={()=> { setModalIsOpen(true);setEdit_id(slide.story_id)}} > Edit  </button>
               
                  </div>
              
                 
              </div>
            ))}
          </Carousel>
          {(modalIsOpen)&&(
        <SlideEditor id={edit_id} />
    )

    } 
        </div>
      ))}

   
    </div>
  );
};


export default Your_stories;

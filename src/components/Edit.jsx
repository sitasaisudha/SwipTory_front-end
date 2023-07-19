import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './SlideFormStyles.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MyContext } from '../MyContext';
import { useContext } from "react"; //using context api

// import SlideEditEditor from "./components/home_components/EditSlides";
Modal.setAppElement('#root');
const showToastSuccessMessage = () => {
  toast.success('Ediited Successfully !', {
    position: toast.POSITION.TOP_CENTER
  });
};

const SlideEdit = ({ index, slide, values, updateSlide, initialValues }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    updateSlide(index, { ...values, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // You can perform additional actions if needed
  };

  return (
    <div className='slide-form'>
      <form onSubmit={handleSubmit}>
       
        <table  style={{border:'none'}} >
          <thead>

          </thead>
          <tbody>
            <tr>
              <td>  Heading:</td>
              <td> <input
            type='text'
            name='heading'
            value={values.heading}
            onChange={handleChange}
          /></td>
            </tr>
            <br/>
            <tr>
              <td> Description:</td>
              <td> <textarea
            name='description'
            value={values.description}
            onChange={handleChange}
          /></td>
            </tr>
            <br/>
            <tr>
              <td>  Image URL:</td>
              <td>  <input
            type='text'
            name='image_url'
            value={values.image_url}
            onChange={handleChange}
          /> </td>
            </tr>
            <br/>
            <tr> <td>
            Categories:
            </td>
            <td>
            <select
            name='categories'
            value={values.categories}
            onChange={handleChange}
          >
            <option value=''>Select Category</option>
            <option value='food'>Food</option>
            <option value='news'>News</option>
            <option value='sports'>Sports</option>
            <option value='plants'>Plants</option>
          </select>
              </td> 
           </tr>
           
          </tbody>
        </table>
       
      
      </form>
    </div>
  );
};

const SlideEditor = (props) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const {modalIsOpen, setModalIsOpen} = useContext(MyContext)

  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [postSlideCount, setPostSlideCount] = useState(0);
  const [dummyData, setdummyData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/slide/?id=${props.id}`)
      .then((resp) => setdummyData(resp.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const initialSlides = dummyData.map((data) => ({ ...data }));
    setSlides(initialSlides);
  }, [dummyData]);

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
  };

  const goToPreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
      setActiveSlide((prevSlide) => prevSlide - 1);
    }
  };

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
      setActiveSlide((prevSlide) => prevSlide + 1);
    }
  };

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  const handlePostSlide = () => {
    const currentValues = slides[currentSlide];
    // console.log('Updated Form Values:', currentValues);
    // console.log(currentValues)
    axios.patch(`http://localhost:4000/api/edit-products`, {
        _id : currentValues._id,
        heading :currentValues.heading,
        description:currentValues.description,
        image_url:currentValues.image_url,
        categories:currentValues.categories
    }).then((res)=> { showToastSuccessMessage();console.log(res)}).catch((err)=> console.log(err))
    setPostSlideCount((prevCount) => prevCount + 1);
  };

  return (
    <div className='models'>
      <Modal
        className='addSlidemodal'
        overlayClassName='slide-modal-overlay'
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel='Slide Editor Modal'
        appElement={document.getElementById('root')}
      >
        <button className='close-button' >
          <i onClick={handleCloseModal} className='ri-close-circle-line'></i>
        </button>
        <br />
        <p className='slide-para'>Edit the slides</p>
        <div className='slide-button-group'>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`slide-btns ${activeSlide === index ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <div>
          {slides.map((slide, index) => (
            <div
              key={index}
              style={{ display: index === currentSlide ? 'block' : 'none' }}
            >
              <SlideEdit
                index={index}
                slide={slide}
                values={slide} // Pass the form values as prop
                updateSlide={updateSlide}
                initialValues={slide}
              />
            </div>
          ))}
        </div>
        <br />
        <div className='form-buttons'>
          <button onClick={goToPreviousSlide} className='prev-btn'>
            Previous Slide
          </button>
          <button onClick={goToNextSlide} className='next-btn'>
            Next Slide
          </button>
          <button onClick={handlePostSlide} className='post-btn'>
            Edit Slide
          </button>
        </div>
      </Modal>
        <ToastContainer />
    </div>
  );
};

export default SlideEditor;

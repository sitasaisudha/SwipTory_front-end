// SharedSlidesPage.js  
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import baseUrl from '.././../constants/Base';

const SharedSlidesPage = ({location}) => {
  const [sharedSlides, setSharedSlides] = useState([]);

  useEffect(() => {
    if (!location) {
      console.log("Location is not available");
      return;
    }

    const queryParams = new URLSearchParams(location.search);
    const storyId = queryParams.get('storyId');

    if (storyId) {
      axios
        .get(`${baseUrl}/api/shared-story-slides?storyId=${storyId}`)
        .then((res) => {
          setSharedSlides(res.data.slides);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location]);

  return (
    <div className="shared-slides-container">
      {sharedSlides.map((slide) => (
        <div key={slide._id} className="shared-slide">
          <img src={slide.image_url} alt={slide.heading} />
          <h3>{slide.heading}</h3>
          <p>{slide.description}</p>
        </div>
      ))}
    </div>
  
  );
};

export default SharedSlidesPage;

import React, { useState, useContext } from "react";
import Stories from "./Stories";
import ErrorBoundary from "./ErrorBoundary";
import { MyContext } from "../../MyContext";
import Your_stories from "./Your_stories";
import "./NavigationCmpntStyle.css";
const NavigationComponent = () => {
  const categories = ["food", "sports", "news", "plants"];
  const { isLogIn, setLogin } = useContext(MyContext);
  const name = localStorage.getItem('name');
  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div>
      <div className="navigation-btn-group">
     <div className="scrollable-outer">
      <div className="scrollable-inner">

        <div
          id="nav-btn1"
          onClick={() => handleCategoryClick("All")}
          className={selectedCategory === "All" ? "selected" : "not-selected"}
        >
          All
        </div>
     
       
        {categories.map((category, index) => (
          <div
          id= {`nav-btn${index+2}`}
            key={index + 2}  // Avoid duplicate IDs with "nav-btn1"
            onClick={() => handleCategoryClick(category)}
            className={selectedCategory === category ? "selected" : "not-selected"}
          >
            {category}
          </div>
        ))}
        </div>
        </div>
        </div>

      {name && selectedCategory === "All" && (
        <div>
          <h4 style={{ textAlign: "center" }}> Your stories</h4>
          <Your_stories />
        </div>
      )}

      {/* Display all stories based on categories */}
      {selectedCategory === "All" && (
        <div>
          {categories.map((category, index) => (
            <div
              key={index}
              style={{ height: "auto", marginTop: "20px" }}
              id={`section${index + 1}`}
            >
              <br/>
              <h3 style={{ textAlign: "center" }}> Top stories about {category}</h3>
              <ErrorBoundary>
                <Stories category={category} />
              </ErrorBoundary>
            </div>
          ))}
        </div>
      )}

      {/* Display stories of a specific category */}
      {categories.map((category, index) => (
        <div
          key={index}
          style={{
            display: selectedCategory === category ? "block" : "none",
            height: "auto",
            marginTop: "20px"
          }}
          id={`section${index + 1}`}
        >
          <br/>
          <h3 style={{ textAlign: "center" }}> Top stories about {category}</h3>
          {selectedCategory === category && (
            <ErrorBoundary>
              <Stories category={category} />
            </ErrorBoundary>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavigationComponent;

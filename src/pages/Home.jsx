import React from "react";
import Navbar from "../components/home_components/Navbar";
import SignIn from "../components/home_components/SignIn";
import SlideEditor from "../components/SlideForm";
import NavigationComponent from "../components/home_components/NavigationComponent";
import MobileNavbar from "../components/home_components/MobileNavbar";
import { useMediaQuery } from "react-responsive";

const Home = () => {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1224px)" });
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });

  return (
    <div>
      {isDesktopOrLaptop ? <Navbar /> : ""}

      {isTabletOrMobile ? <MobileNavbar /> : ""}

      <SignIn />
      <SlideEditor />
      <NavigationComponent />
    </div>
  );
};

export default Home;

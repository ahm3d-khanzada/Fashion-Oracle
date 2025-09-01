import React from 'react';
import { Container } from 'react-bootstrap';
import styled from 'styled-components';
import BackgroundHome from '../Background_home';
import Hero from '../homescreen_components/Hero';
import Marquee from '../homescreen_components/Marquee';
import HorizontalFeatureShowcase from '../homescreen_components/Cards';
import Model from '../homescreen_components/Model';
import CounterSection from '../homescreen_components/Counter';

const StyledContainer = styled(Container)`
  padding: 0; /* Remove padding for full-screen effect */
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh; /* Adjusted to 100vh for a full-screen effect */
  overflow: hidden; /* Hide scrollbars */
`;

const HeroContainer = styled.div`
  width: 100%;
  height: 100vh; /* Make hero section full height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const MainComponent = () => {
  return (
    <>
      <BackgroundHome />
      <StyledContainer>
        <HeroContainer>
          <Hero />
        </HeroContainer>
      </StyledContainer>
      <HorizontalFeatureShowcase/>
      <Model /> {/* Move Model outside of the Container */}
      <CounterSection/>
      <Marquee /> {/* Move Marquee outside of the Container */}

    </>
  );
}

export default MainComponent;

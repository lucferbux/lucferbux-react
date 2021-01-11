import React from "react"
import styled from "styled-components"

const MockupAnimation = () => {
  return (
    <Wrapper>
      <div className="profile" />
      <div className="bulb" />
      <div className="headphones" />
      <div className="folder" />
      <div className="turntable" />
      <div className="gamepad" />
      <div className="computer" />
    </Wrapper>
  )
}

export default MockupAnimation

const Wrapper = styled.div`
  position: relative;

  @media (max-width: 1160px) {
    transform: scale(0.8);
    transform-origin: top right;
  }


  @media (max-width: 948px) {
    transform: scale(0.6);
    transform-origin: top right;
    
  }
  @media (max-width: 450px) {
    transform: scale(0.4) translateX(-40px);

  }

 
  .profile {
    position: absolute;
    width: 301px;
    height: 660px;
    right: 220px;
    top: -120px;
    background: url("/images/animations/profile.png");
    background-size: cover;
    animation: float-profile 4s linear infinite;
    
  }

  @keyframes float-profile {
    0% {
      transform: translate(0px, 0px);
    }
    25% {
      transform: translate(0px, 10px);
    }

    50% {
      transform: translate(0px, 0px);
    }
    75% {
      transform: translate(0px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .bulb {
    position: absolute;
    width: 89px;
    height: 89px;
    right: 620px;
    top: -80px;
    background: url("/images/animations/bulb.png");
    background-size: cover;
    animation: float-bulb 4s ease-out infinite;
  }

  @keyframes float-bulb {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, 10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .headphones {
    position: absolute;
    width: 89px;
    height: 89px;
    right: 650px;
    top: 120px;
    background: url("/images/animations/headphones.png");
    background-size: cover;
    animation: float-headphones 4s ease-out infinite;
  }

  @keyframes float-headphones {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .folder {
    position: absolute;
    width: 114px;
    height: 114px;
    right: 610px;
    top: 320px;
    background: url("/images/animations/folder.png");
    background-size: cover;
    animation: float-folder 4s ease-out infinite;
  }

  @keyframes float-folder {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(10px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .turntable {
    position: absolute;
    width: 100px;
    height: 76px;
    right: 70px;
    top: -70px;
    background: url("/images/animations/turntable.png") center no-repeat;
    background-size: cover;
    animation: float-turntable 4s ease-out infinite;
  }

  @keyframes float-turntable {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, 10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .gamepad {
    position: absolute;
    width: 81px;
    height: 81px;
    right: 25px;
    top: 125px;
    background: url("/images/animations/gamepad.png");
    background-size: cover;
    animation: float-gamepad 4s ease-out infinite;
  }

  @keyframes float-gamepad {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, 0px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .computer {
    position: absolute;
    width: 108px;
    height: 108px;
    right: 60px;
    top: 320px;
    background: url("/images/animations/computer.png");
    background-size: cover;
    animation: float-computer 4s ease-out infinite;
  }

  @keyframes float-computer {
    0% {
      transform: translate(0px, 0px);
    }

    50% {
      transform: translate(-10px, -10px);
    }
    100% {
      transform: translate(0px, 0px);
    }
  }

  .mockup1 {
    position: absolute;
    width: 183px;
    height: 120px;
    right: 617px;
    top: 0px;

    background: url("/images/animations/mockup1.svg"),
      radial-gradient(
        218.51% 281.09% at 100% 100%,
        rgba(253, 63, 51, 0.6) 0%,
        rgba(76, 0, 200, 0.6) 45.83%,
        rgba(76, 0, 200, 0.6) 100%
      );
    border: 0.273134px solid rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    box-shadow: 0px 16.3881px 32.7761px rgba(99, 30, 187, 0.5);
    backdrop-filter: blur(21.8507px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 16.3881px;
  }

  .mockup2 {
    position: absolute;
    width: 183px;
    height: 120px;
    right: 403px;
    top: 0px;

    background: url("/images/animations/mockup2.svg"),
      linear-gradient(
        198.85deg,
        #4316db 12.72%,
        #9076e7 54.49%,
        #a2eeff 100.01%
      );
    border: 0.27304px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0px 8.19119px 16.3824px rgba(0, 0, 0, 0.1),
      0px 16.3824px 32.7648px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(21.8432px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 16.3824px;
  }

  .mockup3 {
    position: absolute;
    width: 701px;
    height: 428px;
    right: 62px;
    top: 60px;
    background: url("/images/animations/mockup3.svg"), rgba(23, 12, 61, 0.5);
    border: 0.342305px solid rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(27.3844px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 6.8461px;
  }

  .mockup4 {
    position: absolute;
    width: 399px;
    height: 274px;
    right: 207px;
    top: 262px;
    background: url("/images/animations/mockup4.svg"), rgba(39, 20, 62, 0.3);
    border: 0.5px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    backdrop-filter: blur(27.3844px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 14px;
  }

  .mockup5 {
    position: absolute;
    width: 412px;
    height: 274px;
    right: -228px;
    top: 262px;
    background: url("/images/animations/mockup5.svg"), rgba(39, 20, 62, 0.2);
    border: 0.5px solid rgba(255, 255, 255, 0.2);
    box-sizing: border-box;
    backdrop-filter: blur(27.3844px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 14px;
  }
`

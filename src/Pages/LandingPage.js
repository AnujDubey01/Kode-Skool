import React from 'react';
import { useState, useEffect } from 'react';
import '../css/landingPage.css';
import Navbar from '../Components/Navbar';
import heroImage from '../assets/img/header-img.png';

import CompanySectionLogo from '../assets/img/company-section-logo.png'; // Import images to avoid errors
import whyCard1 from '../assets/img/why-card-1.png';
import tickIcon from '../assets/img/tick.png';
import whyChoose2 from '../assets/img/why-choose-2.png';
import whyChoose3 from '../assets/img/why-choose-3.png';
import bigFeature1 from '../assets/img/big-feature-1.png';
import bigFeature2 from '../assets/img/big-feature-2.png';
import bigFeature3 from '../assets/img/big-feature-3.png';
import bigFeature4 from '../assets/img/big-feature-4.png';
import downloadSection from '../assets/img/download-section.png';
import Footer from '../Components/Footer';

function LandingPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  const faqData = [
    {
      question: 'What age group is the platform designed for?',
      answer: 'Answer1.',
    },
    {
      question: 'How do the video lessons and animations help me learn coding?',
      answer: 'Answer2',
    },
    {
      question: 'Do I need any prior coding experience to start?',
      answer: 'Answer3',
    },
    {
      question: 'How do the coding exercises work?',
      answer: 'Answer4',
    },
    {
      question: 'Can I learn at my own pace?',
      answer: 'Answer5',
    },
    {
      question: 'Does the platform align with my school\'s curriculum?',
      answer: 'Answer6',
    },
    {
      question: 'Are there any quizzes or tests to check my progress?',
      answer: 'Answer7',
    },
    {
      question: 'Is there any support if I get stuck or have questions?',
      answer: 'Answer10',
    },
  ];

  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    {
      id: 1,
      img: bigFeature1,
      title: "Learn with animated videos",
      description: "Engage with fun and interactive animations that make coding concepts easy to understand and remember."
    },
    {
      id: 2,
      img: bigFeature2,
      title: "Code and create with ease",
      description: "Our simple editor helps students from 8th to 12th grade practice and improve their coding skills."
    },
    {
      id: 3,
      img: bigFeature3,
      title: "Master Coding with Our Interactive Editor",
      description: "Practice coding easily and improve your skills with our simple and user-friendly editor."
    },
    {
      id: 4,
      img: bigFeature4,
      title: "Assessments, Quizzes, Tests",
      description: "Easily launch live assignments, quizzes and tests. Student results are automatically entered in the online gradebook."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <>
      <section id="hero">
        <Navbar />

        <header>
          <div className="container">
            <div className="row d-flex flex-row justify-content-center align-items-center">
              <div className="col-md-6 ps-5 order-2 order-md-1">
                <h1 className="head-title mb-3">Become a coding champ</h1>
                <p className="head-txt mb-4">
                  Engaging Lessons for Future Tech Leaders.
                </p>
                <button type="button" className="btn btn2">Let's Start</button>
              </div>
              <div className="col-md-6 text-center order-1 order-md-2">
                <img src={heroImage} alt="HeroImg" className="hero-img" />
              </div>
            </div>
          </div>
        </header>
      </section>

      <section id="banner">
        <div className="container banner-content">
          <div className="px-2 d-flex justify-content-center align-items-center gap-3">
            <img src={CompanySectionLogo} alt="KodeSkool" className="banner-img" />
            <h3 className="banner-txt">KodeSkool Makes Coding Fun For School Students With Interactive Animations.</h3>
          </div>
        </div>
      </section>

      <section id="skills" className="skills my-5 p-5">
        <div className="container skills-container d-flex justify-content-center align-items-center flex-column flex-wrap">
          <h1 className="skills-heading">Develop your skills and stand out</h1>
          <div className="skills-box d-flex justify-content-center align-items-center flex-wrap">
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-html5"></i>
                <h3>HTML</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-css3"></i>
                <h3>CSS</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-js"></i>
                <h3>JavaScript</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-solid fa-c"></i>
                <h3>C Lang</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-java"></i>
                <h3>Java</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-python"></i>
                <h3>Python</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-brands fa-node"></i>
                <h3>Node.js</h3>
              </div>
            </div>
            <div className="skill-card">
              <div className="skill-icon-container">
                <i className="fa-solid fa-database"></i>
                <h3>Database</h3>
              </div>
            </div>
          </div>
          <div className="ex-btn px-5 py-2">
            <button type="button" className="btn btn3">Explore</button>
          </div>
        </div>
      </section>

      <section id="choose-us" className="choose-us my-5 d-flex flex-column justify-content-center align-items-center">
        <div className="choose-us-head">
          <h1 className="section-heading">Why Schools choose us?</h1>
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-4 card-outline">
              <div className="card my-2 p-4">
                <div className="img-container">
                  <img src={whyCard1} className="card-img-top" alt="choose-us-1" />
                </div>
                <div className="card-body">
                  <div className="card-head d-flex align-items-center gap-2">
                    <h4 className="card-title sub-head">Personalized learning</h4>
                    <img src={tickIcon} alt="Tick" className="verify-tick d-flex justify-content-center" />
                  </div>
                  <div className="card-content">
                    <p className="card-detail">Unlock your potential with personalized coding lessons that make learning fun and engaging.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card my-2 p-4">
                <div className="img-container">
                  <img src={whyChoose2} className="card-img-top" alt="choose-us-2" />
                </div>
                <div className="card-body">
                  <div className="card-head d-flex align-items-center gap-2">
                    <h4 className="card-title sub-head">Trusted content</h4>
                    <img src={tickIcon} alt="Tick" className="verify-tick d-flex justify-content-center" />
                  </div>
                  <div className="card-content">
                    <p className="card-detail">Learn coding with content you can trust, made by experts to give you the best and most reliable learning experience.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card my-2 p-4">
                <div className="img-container">
                  <img src={whyChoose3} className="card-img-top" alt="choose-us-3" />
                </div>
                <div className="card-body">
                  <div className="card-head d-flex align-items-center gap-2">
                    <h4 className="card-title sub-head">Empower teachers</h4>
                    <img src={tickIcon} alt="Tick" className="verify-tick d-flex justify-content-center" />
                  </div>
                  <div className="card-content">
                    <p className="card-detail">Give teachers easy-to-use tools that make coding lessons fun and help them inspire students to learn.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features mt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="features-head mt-5">
          <h1 className="section-heading">What KodeSkool is providing?</h1>
        </div>
        <div className="features-container container mt-5 pt-3">
          <div className="row">
            {features.map((feature, index) => {
              if (window.innerWidth < 426) {
                return (
                  <div
                    key={feature.id}
                    className={`features-box my-5 ${activeFeature === index ? 'active' : ''}`}
                    style={{ transform: `translateX(${(index - activeFeature) * 100}%)` }}
                  >
                    <div className="row">
                      <div className="col-md-5 d-flex justify-content-center align-items-center">
                        <img src={feature.img} className="features-img" alt={feature.title} />
                      </div>
                      <div className="features-content col-md-7 mt-5 d-flex flex-column justify-content-center gap-2">
                        <h4 className="features-sub-head">{feature.title}</h4>
                        <p className="features-details">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                )
              } else {
                if (index % 2 === 0) {
                  return (
                    <div
                      key={feature.id}
                      className='features-box my-5'
                    >
                      <div className="row">
                        <div className="col-md-5 d-flex justify-content-center align-items-center">
                          <img src={feature.img} className="features-img" alt={feature.title} />
                        </div>
                        <div className="features-content col-md-7 mt-5 d-flex flex-column justify-content-center gap-2">
                          <h4 className="features-sub-head">{feature.title}</h4>
                          <p className="features-details">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div
                      key={feature.id}
                      className='features-box my-5'
                    >
                      <div className={window.innerWidth < 768 ? 'row ' : 'd-flex flex-row-reverse'}>
                        <div className="col-md-5 d-flex justify-content-center align-items-center">
                          <img src={feature.img} className="features-img" alt={feature.title} />
                        </div>
                        <div className="features-content col-md-7 mt-5 d-flex flex-column justify-content-center gap-2">
                          <h4 className="features-sub-head">{feature.title}</h4>
                          <p className="features-details">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                }
              }
            })}
          </div>
        </div>
      </section>

      <section id="faq" className="faq-section my-5 pt-5 d-flex flex-column justify-content-center align-items-center">
        <div className="faq-head">
          <h1 className="section-heading">Frequently Asked Questions</h1>
        </div>
        <div className="container faq-section-container">
          <div className="faq-section-questions-container mt-5" id="faqContainer">
            {faqData.map((faq, index) => (
              <div className="faq-question-card" key={index}>
                <div
                  className="faq-question-card-details"
                  onClick={() => toggleFAQ(index)}
                >
                  <p>{faq.question}</p>
                  <i className={`fa-solid ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                </div>
                <div
                  className="faq-answer"
                  style={{ display: activeIndex === index ? 'block' : 'none' }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="start-learning">
        <section className="download-section">
          <div className="container download-section-container">
            <img src={downloadSection} className="download-section-img" alt="" />
            <div className="download-section-details">
              <h1 className="download-section-head">Start your coding adventure with KodeSkool</h1>
              <div className="start-learning-btn">
                <button type="button" className="btn btn3">Start Learning</button>
              </div>
            </div>
          </div>
        </section>
      </section>

      <Footer />
    </>
  )
}

export default LandingPage
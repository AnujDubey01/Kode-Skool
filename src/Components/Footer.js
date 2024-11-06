import React from 'react'
import './Footer.css';

import FooterLogo from '../Assets/Img/footer-logo.png';



function Footer() {
    return (
        <footer className="text-center text-lg-start bg-body-tertiary text-muted mt-4 px-5 pt-5">
            <section className="container text-center text-md-start mt-5">
                    <div className={`d-flex ${window.innerWidth < 768 ? 'flex-column' : 'flex-row'} mt-3`}>
                        {/* Footer Logo and Social Links */}
                        <div className="footer-main d-flex flex-column col-md-3 col-lg-4 col-xl-3 mx-4 mb-4 gap-4">
                            <img src={FooterLogo} className="footer-logo" alt="Logo" />
                            <p>
                                KodeSkool makes coding fun for school students with interactive animations
                            </p>
                            <div className="socials">
                                <div className="social-icons">
                                    <a href="#!"><i className="fa-brands fa-x-twitter"></i></a>
                                    <a href="#!"><i className="fa-brands fa-instagram"></i></a>
                                    <a href="#!"><i className="fa-brands fa-facebook"></i></a>
                                    <a href="#!"><i className="fa-brands fa-linkedin"></i></a>
                                    <a href="#!"><i className="fa-brands fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex flex-row gap-1 mt-4 mx-2 justify-content-around" style={{width: '100%'}}>
                            {/* KodeSkool Section */}
                            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="footer-head mb-4">KodeSkool</h6>
                                <p><a href="#!" className="footer-link">C++</a></p>
                                <p><a href="#!" className="footer-link">Java</a></p>
                                <p><a href="#!" className="footer-link">JavaScript</a></p>
                                <p><a href="#!" className="footer-link">Python</a></p>
                                <p><a href="#!" className="footer-link">SQL</a></p>
                                <p><a href="#!" className="footer-link">Swift</a></p>
                            </div>

                            {/* Legal Section */}
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="footer-head mb-4">Legal</h6>
                                <p><a href="#!" className="footer-link">Terms & conditions</a></p>
                                <p><a href="#!" className="footer-link">Privacy Policy</a></p>
                            </div>

                            {/* Company Section */}
                            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 className="footer-head mb-4">Company</h6>
                                <p><a href="#!" className="footer-link">About us</a></p>
                                <p><a href="#!" className="footer-link">Contact us</a></p>
                                <p><a href="#!" className="footer-link">FAQ</a></p>
                            </div>
                        </div>
                    </div>
            </section>

            <hr />

            <div className="footer-copyright text-center p-4">
                © Copyright 2024 Home Helps. All rights reserved
            </div>
        </footer>
    )
}

export default Footer
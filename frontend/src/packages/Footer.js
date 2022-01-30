import {MDBFooter, MDBIcon} from "mdb-react-ui-kit";

export default function Footer() {
    return (
        <MDBFooter bgColor='dark' className='text-center text-lg-start'>
            <section className='d-flex justify-content-center justify-content-lg-between p-3 border-bottom-dark'>
                <div className='container text-center text-md-start'>
                    <div className='row mt-3'>
                        <div className='col-md-3 col-lg-4 col-xl-3 mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>
                                Hasan Abi Fan Page
                            </h6>
                            <p>
                                a political commentator irl trying to avoid heated gaming moments
                            </p>
                        </div>

                        <div className='col-md-2 col-lg-2 col-xl-2 mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Just don't</h6>
                            <p>
                                <a href='https://www.reddit.com/r/Hasan_Piker/' className='text-reset'>
                                    <MDBIcon fab icon="reddit-alien" className='me-2' />Reddit
                                </a>
                            </p>
                        </div>

                        <div className='col-md-3 col-lg-2 col-xl-2 mx-auto mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Social media</h6>
                            <p>
                                <a href='https://www.instagram.com/hasandpiker' className='text-reset'>
                                    <MDBIcon fab icon='instagram' className='me-2' />Instagram
                                </a>
                            </p>
                            <p>
                                <a href='https://www.discord.gg/hasan' className='text-reset'>
                                    <MDBIcon fab icon="discord" className='me-2' />Discord
                                </a>
                            </p>
                            <p>
                                <a href='https://www.twitter.com/hasanthehun' className='text-reset'>
                                    <MDBIcon fab icon='twitter' className='me-2' />Twitter
                                </a>
                            </p>
                            <p>
                                <a href='https://www.youtube.com/hasanabi' className='text-reset'>
                                    <MDBIcon fab icon="youtube" className='me-2' />Youtube
                                </a>
                            </p>
                        </div>

                        <div className='col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4'>
                            <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
                            <p>
                                <i className='fas fa-envelope me-2'/>Hasan's business email
                            </p>
                            <p>
                                <a href='mailto:hasanpiker@wmeagency.com' className='text-reset'>
                                    hasanpiker@wmeagency.com
                                </a>
                            </p>
                            <p>
                                <i className='fas fa-envelope me-2'/>Fan page email
                            </p>
                            <p>
                                <a href='mailto:contact@hasanabi.tv' className='text-reset'>
                                    contact@hasanabi.tv
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
                Created by <a className='text-reset fw-bold' href='https://s-uit.pl/'> s-uit.pl </a>in 2022
            </div>
        </MDBFooter>
    );
}
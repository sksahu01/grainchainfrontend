import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-600 to-green-800 text-white py-24">
                <div className="absolute inset-0 overflow-hidden opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1543362906-acfc16c67564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'blur(1px)'
                    }}></div>
                </div>

                <div className="container mx-auto px-4 flex flex-col items-center text-center relative z-10">
                    <span className="bg-green-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6 animate-pulse">
                        Fighting Food Waste Together
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                        Zero Food Waste,<br className="hidden md:block" /> More Meals for All
                    </h1>
                    <p className="text-xl max-w-2xl mb-10 text-green-100">
                        Join our platform to donate surplus food or receive donations.
                        Together we can reduce food waste and fight hunger in our communities.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4">
                        <Link
                            to="/register?role=donor"
                            className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Become a Donor
                        </Link>
                        <Link
                            to="/register?role=receiver"
                            className="bg-transparent border-2 border-white hover:bg-white hover:text-green-700 text-white px-8 py-4 rounded-md font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Register as Receiver
                        </Link>
                    </div>

                    <div className="mt-16 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-3xl w-full">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">10,000+</div>
                                <p className="text-green-100 text-sm">Meals Saved</p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">500+</div>
                                <p className="text-green-100 text-sm">Partners</p>
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold mb-1">5,000 kg</div>
                                <p className="text-green-100 text-sm">CO₂ Reduction</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="relative block w-full h-[80px]">
                        <path
                            fill="#ffffff"
                            fillOpacity="1"
                            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                        ></path>
                    </svg>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Simple Process</span>
                        <h2 className="text-4xl font-bold mt-2 mb-4">How GrainChain Works</h2>
                        <p className="text-gray-600 text-lg">
                            Our platform makes it easy to connect surplus food with those who need it most,
                            reducing waste and making a positive impact on our communities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-green-500">
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white text-2xl font-bold">1</span>
                                </div>
                            </div>
                            <div className="pt-10">
                                <div className="text-center mb-8">
                                    <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold mb-3">Donate Surplus Food</h3>
                                </div>
                                <p className="text-gray-600 text-center">
                                    Restaurants, grocers, and individuals can easily list surplus food items
                                    that would otherwise go to waste with just a few clicks.
                                </p>
                                <div className="mt-6 text-center">
                                    <Link to="/register?role=donor" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                                        Start donating
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-green-500">
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white text-2xl font-bold">2</span>
                                </div>
                            </div>
                            <div className="pt-10">
                                <div className="text-center mb-8">
                                    <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold mb-3">Request & Schedule</h3>
                                </div>
                                <p className="text-gray-600 text-center">
                                    Food banks, shelters, and community organizations can browse available
                                    donations and schedule pickups at convenient times.
                                </p>
                                <div className="mt-6 text-center">
                                    <Link to="/register?role=receiver" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                                        Start receiving
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-8 border-t-4 border-green-500">
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
                                <div className="bg-gradient-to-r from-green-500 to-green-600 w-20 h-20 rounded-full flex items-center justify-center shadow-md">
                                    <span className="text-white text-2xl font-bold">3</span>
                                </div>
                            </div>
                            <div className="pt-10">
                                <div className="text-center mb-8">
                                    <svg className="w-16 h-16 mx-auto text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <h3 className="text-2xl font-bold mb-3">Track Impact</h3>
                                </div>
                                <p className="text-gray-600 text-center">
                                    Track the impact of your donations or received items, and see how much
                                    food waste and CO₂ emissions you've prevented.
                                </p>
                                <div className="mt-6 text-center">
                                    <Link to="/about" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                                        Learn more
                                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Impact Section */}
            <section className="py-24 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute top-0 left-0 opacity-10">
                        <path fill="#0d9488" fillOpacity="1" d="M0,160L48,176C96,192,192,224,288,240C384,256,480,256,576,218.7C672,181,768,107,864,101.3C960,96,1056,160,1152,186.7C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Making a Difference</span>
                        <h2 className="text-4xl font-bold mt-2 mb-4">Our Impact So Far</h2>
                        <p className="text-gray-600 text-lg">
                            Together with our partners and users, we're making significant progress
                            towards reducing food waste and helping communities in need.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 mb-16">
                        <div className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="rounded-full bg-white w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-5xl font-bold text-gray-800 mb-2">10,000+</div>
                            <p className="text-gray-600 text-xl">Meals Saved</p>
                            <p className="text-gray-500 mt-2">Food that would have gone to waste has been distributed to people in need</p>
                        </div>

                        <div className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="rounded-full bg-white w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="text-5xl font-bold text-gray-800 mb-2">500+</div>
                            <p className="text-gray-600 text-xl">Partner Organizations</p>
                            <p className="text-gray-500 mt-2">Restaurants, grocers, food banks, and community organizations working together</p>
                        </div>

                        <div className="text-center transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="rounded-full bg-white w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-5xl font-bold text-gray-800 mb-2">5,000 kg</div>
                            <p className="text-gray-600 text-xl">CO₂ Emissions Prevented</p>
                            <p className="text-gray-500 mt-2">Reducing the environmental impact of food waste on our planet</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/about"
                            className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 font-medium"
                        >
                            Learn More About Our Mission
                            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white relative">
                <div className="absolute top-0 right-0 h-full w-1/3 bg-green-50 rounded-l-3xl hidden lg:block"></div>
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
                        <h2 className="text-4xl font-bold mt-2 mb-4">What Our Community Says</h2>
                        <p className="text-gray-600 text-lg">
                            Hear from donors, receivers, and partners about their experience with GrainChain
                            and the impact it's making in their communities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">
                        {/* Testimonial 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                    alt="Robin Chen"
                                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-500"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">Robin Chen</h4>
                                    <p className="text-sm text-gray-600">Restaurant Owner</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex text-yellow-400 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                "GrainChain has been a game-changer for our restaurant. Instead of throwing away
                                unsold food at the end of the day, we can donate it to those who need it most.
                                The process is seamless and the impact tracking gives us valuable data for our sustainability reports."
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="text-green-600 font-medium">Restaurant Partner since 2024</span>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 md:translate-y-8">
                            <div className="flex items-center mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                    alt="Maria Santos"
                                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-500"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">Maria Santos</h4>
                                    <p className="text-sm text-gray-600">Food Bank Manager</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex text-yellow-400 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                "The platform makes it easy for us to see what's available nearby and schedule
                                pickups. We've been able to serve 30% more meals since joining GrainChain.
                                The real-time notifications about new donations have been especially helpful for our operations."
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="text-green-600 font-medium">Food Bank Partner since 2023</span>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <img
                                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                                    alt="James Thompson"
                                    className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-green-500"
                                />
                                <div>
                                    <h4 className="font-bold text-lg">James Thompson</h4>
                                    <p className="text-sm text-gray-600">Grocery Store Manager</p>
                                </div>
                            </div>
                            <div className="mb-6">
                                <div className="flex text-yellow-400 mb-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill={i < 4 ? "currentColor" : "none"} stroke={i >= 4 ? "currentColor" : "none"} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                "The analytics dashboard helps us track our impact and share it with our customers.
                                It's become part of our sustainability story and customers love it.
                                GrainChain has transformed the way we handle excess inventory and contribute to our community."
                            </p>
                            <div className="pt-4 border-t border-gray-100">
                                <span className="text-green-600 font-medium">Grocery Partner since 2024</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-16">
                        <Link to="/testimonials" className="text-green-600 hover:text-green-800 font-medium inline-flex items-center">
                            Read more testimonials
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-r from-green-600 to-green-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 0 10 L 40 10 M 10 0 L 10 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Animated circles */}
                <div className="absolute top-20 left-10 w-64 h-64 bg-white opacity-5 rounded-full"></div>
                <div className="absolute bottom-10 right-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>

                <div className="container mx-auto px-4 text-center relative z-10">
                    <div className="max-w-3xl mx-auto">
                        <span className="inline-block px-4 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm font-semibold mb-6">
                            Take Action Today
                        </span>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                            Ready to Make a <span className="text-green-200">Difference</span> in Your Community?
                        </h2>

                        <p className="text-xl text-green-100 mx-auto mb-10">
                            Join GrainChain today and be part of the solution to reduce food waste
                            and help feed those in need in your community.
                        </p>

                        <div className="flex flex-col md:flex-row justify-center gap-6">
                            <Link
                                to="/register"
                                className="bg-white hover:bg-green-50 text-green-700 px-8 py-4 rounded-md font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                Sign Up Now
                            </Link>
                            <Link
                                to="/login"
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-md font-bold text-lg transition-all duration-300"
                            >
                                Login
                            </Link>
                        </div>

                        <div className="mt-12 pt-12 border-t border-white border-opacity-20 text-center">
                            <h3 className="text-white text-xl font-medium mb-6">Our Partners</h3>
                            <div className="flex justify-center space-x-8 items-center flex-wrap gap-y-4">
                                <div className="bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                                    <span className="text-white font-bold">FoodBank</span>
                                </div>
                                <div className="bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                                    <span className="text-white font-bold">GreenEats</span>
                                </div>
                                <div className="bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                                    <span className="text-white font-bold">FreshMart</span>
                                </div>
                                <div className="bg-white bg-opacity-10 px-4 py-2 rounded-lg">
                                    <span className="text-white font-bold">CommunityCare</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;

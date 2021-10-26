import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import './LandingLogin.scss'


export function LandingLogin(props) {

    useEffect(() => {
        const next = document.querySelector('.next')
        const prev = document.querySelector('.prev')
        const dots = document.querySelectorAll('.dot')
        const slides = document.querySelectorAll('.slides')
        const thumb = document.querySelectorAll('.thumb')

        let index = 1
        function show(n) {

            if (n > slides.length) index = 1
            if (n < 1) index = slides.length
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.transform = `translateX(0)`
                slides[i].className = slides[i].className.replace('fade', '')
            }
            slides[index - 1].style.transform = `translateX(-${(index - 1) * 100}%)`
            slides[index - 1].className += ' fade'

            //dots
            for (let i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace('active', '')
            }
            dots[index - 1].className += ' active'
        }

        next.addEventListener('click', () => {
            show(index += 1)
            thumb[1].classList.add('effects')
            setTimeout(() => {
                nextSlide()
            }, 500)
        })
        prev.addEventListener('click', () => {
            show(index -= 1)
            thumb[0].classList.remove('effects')
            setTimeout(() => {
                prevSlide()
            }, 500)
        })

        //slides-small
        let thumbArray = []
        for (let i = 0; i < thumb.length; i++) {
            thumbArray[i] = thumb[i].innerHTML;
        }

        function nextSlide() {
            let change = thumbArray.shift()
            thumbArray.push(change)
            for (let i = 0; i < thumb.length; i++) {
                thumb[i].innerHTML = thumbArray[i]
            }
            thumb[1].classList.remove('effects')
        }

        function prevSlide() {
            let change = thumbArray.pop()
            thumbArray.unshift(change)
            for (let i = 0; i < thumb.length; i++) {
                thumb[i].innerHTML = thumbArray[i]
            }
            thumb[0].classList.add('effects')
        }
    })

    return (
        <>
            <section>
                <div className="container">
                    <div className="slides">
                        <img src="https://images.unsplash.com/photo-1598544919456-fcb105fa7a6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1189&q=80" alt="" />
                        <div className="content">
                            <h2>ho chi minh</h2>
                            <p>
                                Vibrating with energy, innovation and traffic – lots of traffic – Ho Chi Minh City, formerly known as Saigon, is the economic heart of Vietnam and the main hub of the southern region. A freewheeling, cosmopolitan metropolis, HCMC's dynamic cityscape draws together old and new Vietnam in the most compact of spaces, representing the city’s past as well as its future.
                            </p>
                            <Link to={'/itinerary'}>Book a trip</Link>
                            <Link id='explore' to={'/place'}>explore</Link>
                        </div>
                    </div>

                    <div className="slides">
                        <img src="https://images.pexels.com/photos/7909256/pexels-photo-7909256.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="" />
                        <div className="content">
                            <h2>Ha Long Bay</h2>
                            <p>
                                Ha Long Bay is a UNESCO World Heritage Site and popular travel destination in Quảng Ninh Province, Vietnam. Halong Bay is a beautiful natural wonder in northern Vietnam near the Chinese border. The Bay is dotted with 1,600 limestone islands and islets and covers an area of over 1,500 sqkm. In Vietnamese, Ha Long means “Descending Dragon.” Dragons play a prominent role in Vietnamese culture, and the most popular legend has it that one such creature and her children descended from heaven to defend the Viet people from invaders, spraying fire and emeralds or jade. She and her children then stayed on Earth.
                            </p>
                            <Link to={'/itinerary'}>Book a trip</Link>
                            <Link id='explore' to={'/place'}>explore</Link>
                        </div>
                    </div>

                    <div className="slides">
                        <img src="https://vietnam.travel/sites/default/files/styles/top_banner/public/2017-06/vietnam-travel-5.jpg?itok=XVnHP3ty" alt="" />
                        <div className="content">
                            <h2>ha noi</h2>
                            <p>
                                The capital of Vietnam, Hanoi has bounded back from the effects of war, and today serves as a bustling commercial and cultural hub bursting at the seams. Chinese and French colonialism have left their mark in the city's architecture, replete with pagodas and European neoclassicism. But the recent history on display is a key part of any trip to Hanoi: the city's national museums, war memorials, and the "temple" to education at its university offer fascinating glimpses into the country's proud self-identification. Between the can't-miss attractions in Hanoi, spend time walking its crowded, motorbike-dense streets. Sample delectable street food and regional cuisines from all over the country, and spend your nights people-watching with a drink and a seat at a sidewalk table.
                            </p>
                            <Link to={'/itinerary'}>Book a trip</Link>
                            <Link id='explore' to={'/place'}>explore</Link>
                        </div>
                    </div>

                    <div className="slides">
                        <img src="https://images.unsplash.com/photo-1560964645-5296b5099677?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" alt="" />
                        <div className="content">
                            <h2>Da Nang</h2>
                            <p>
                                Da Nang marks the halfway point between the capital in the north, Hanoi, and Ho Chi Minh City in the south. It’s the fourth largest city in Vietnam. Apart from some shopping highlights and historical sights, the main reason for most travellers staying here is its proximity to the well-known My Khe Beach, Lang Co Beach, Hoi An and My Son.
                            </p>
                            <Link to={'/itinerary'}>Book a trip</Link>
                            <Link id='explore' to={'/place'}>explore</Link>
                        </div>
                    </div>

                    <div className="overlay"></div>
                </div>

                <div className="slides-small">
                    <div className="thumb effects">
                        <p>D1, Ho Chi Minh</p>
                        <img src="https://images.unsplash.com/photo-1602646993776-5dd8e166e6fd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8aG8lMjBjaGklMjBtaW5oJTIwY2l0eXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="" />
                        <i className='fa fa-bookmark'></i>
                    </div>
                    <div className="thumb">
                        <p>Ha Long Bay</p>
                        <img src="https://images.unsplash.com/photo-1552964397-690905993bd9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGElMjBsb25nJTIwYmF5fGVufDB8MXwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="" />
                        <i className='fa fa-bookmark'></i>
                    </div>
                    <div className="thumb">
                        <p>Ha Noi</p>
                        <img src="https://images.unsplash.com/photo-1555921015-5532091f6026?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aGFub2l8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="" />
                        <i className='fa fa-bookmark'></i>
                    </div>
                    <div className="thumb">
                        <p>Ba Na Hills</p>
                        <img src="https://images.unsplash.com/photo-1578875938430-a40a020737c3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80" alt="" />
                        <i className='fa fa-bookmark'></i>
                    </div>
                </div>

                <button className='prev'>
                    <i className="fas fa-angle-left"></i>
                </button>

                <button className='next'>
                    <i className="fas fa-angle-right"></i>
                </button>

                <div className="nav">
                    <span className="dot active">1</span>
                    <span className="dot">2</span>
                    <span className="dot">3</span>
                    <span className="dot">4</span>
                </div>
            </section>
        </>
    )
}

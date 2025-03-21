// app/components/FeaturedCarousel.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function FeaturedCarousel() {
  return (
    <div className="featured-games header-text">
      <div className="heading-section">
        <h4>
          <em>Live</em> Streams
        </h4>
      </div>
      <Swiper
        modules={[Navigation]}
        loop={true}
        spaceBetween={30}
        navigation={true}
        breakpoints={{
          0: { slidesPerView: 1 },
          600: { slidesPerView: 2 },
          1000: { slidesPerView: 3 },
        }}
        className="owl-features"
      >
        <SwiperSlide>
          <div className="item">
            <div className="thumb">
              <img src="/assets/images/featured-01.jpg" alt="" />
              <div className="hover-effect">
                <h6>2.4K Streaming</h6>
              </div>
            </div>
            <h4>
              CS-GO<br />
              <span>249K Downloads</span>
            </h4>
            <ul>
              <li>
                <i className="fa fa-star"></i> 4.8
              </li>
              <li>
                <i className="fa fa-download"></i> 2.3M
              </li>
            </ul>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="item">
            <div className="thumb">
              <img src="/assets/images/featured-02.jpg" alt="" />
              <div className="hover-effect">
                <h6>2.4K Streaming</h6>
              </div>
            </div>
            <h4>
              Gamezer<br />
              <span>249K Downloads</span>
            </h4>
            <ul>
              <li>
                <i className="fa fa-star"></i> 4.8
              </li>
              <li>
                <i className="fa fa-download"></i> 2.3M
              </li>
            </ul>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="item">
            <div className="thumb">
              <img src="/assets/images/featured-03.jpg" alt="" />
              <div className="hover-effect">
                <h6>2.4K Streaming</h6>
              </div>
            </div>
            <h4>
              Island Rusty<br />
              <span>249K Downloads</span>
            </h4>
            <ul>
              <li>
                <i className="fa fa-star"></i> 4.8
              </li>
              <li>
                <i className="fa fa-download"></i> 2.3M
              </li>
            </ul>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="item">
            <div className="thumb">
              <img src="/assets/images/featured-01.jpg" alt="" />
              <div className="hover-effect">
                <h6>2.4K Streaming</h6>
              </div>
            </div>
            <h4>
              CS-GO Duplicate<br />
              <span>249K Downloads</span>
            </h4>
            <ul>
              <li>
                <i className="fa fa-star"></i> 4.8
              </li>
              <li>
                <i className="fa fa-download"></i> 2.3M
              </li>
            </ul>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
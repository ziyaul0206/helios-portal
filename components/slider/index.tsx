import { useRef } from "react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Pagination, Parallax } from "swiper/modules"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import s from "./slider.module.scss"

interface SliderProps {
  slides: {
    title: string
    description: string
  }[]
}

export const Slider = ({ slides }: SliderProps) => {
  const sliderRef = useRef<SwiperRef>(null)

  return (
    <>
      <div className={s.slider}>
        <Swiper
          ref={sliderRef}
          className={s.steps}
          spaceBetween={0}
          modules={[Pagination, Parallax]}
          parallax={true}
          speed={800}
          pagination={{
            clickable: true,
            bulletClass: s.bullet,
            bulletActiveClass: s.bulletActive,
            el: `.${s.pagination}`
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className={s.step}>
              <div className={s.content}>
                <small data-swiper-parallax="-100">Step {index + 1}</small>
                <h3 data-swiper-parallax="-200">{slide.title}</h3>
                <p data-swiper-parallax="-300">{slide.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={s.pagination} />
    </>
  )
}

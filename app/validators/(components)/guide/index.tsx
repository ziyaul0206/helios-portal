"use client"

import { Card } from "@/components/card"
import { Heading } from "@/components/heading"
import { useRef } from "react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { Pagination, Parallax } from "swiper/modules"
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react"
import s from "./guide.module.scss"

export const Guide = () => {
  const sliderRef = useRef<SwiperRef>(null)
  const steps = [
    {
      title: "Choose a Validator",
      description:
        "Select a validator based on their performance metrics, reputation, and boost status. Featured validators are community-vetted for reliability."
    },
    {
      title: "Stake Your Assets",
      description:
        "Delegate your assets to the selected validator. You can stake multiple asset types including HLS, ETH, BNB, and stablecoins."
    },
    {
      title: "Earn Rewards",
      description:
        "Receive staking rewards automatically every epoch (24 hours). Your APY is affected by the validator's boost status and commission rate."
    }
  ]

  return (
    <Card className={s.guide} auto>
      <Heading icon="hugeicons:bubble-chat-question" title="Staking Guide" />
      <div className={s.container}>
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
          {steps.map((step, index) => (
            <SwiperSlide key={index} className={s.step}>
              <div className={s.content}>
                <small data-swiper-parallax="-100">Step {index + 1}</small>
                <h3 data-swiper-parallax="-200">{step.title}</h3>
                <p data-swiper-parallax="-300">{step.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className={s.pagination} />
      </div>
    </Card>
  )
}

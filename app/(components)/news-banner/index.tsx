import s from "./news-banner.module.scss"

export const NewsBanner = () => {
  return (
    <div className={s.banner}>
      <div className={s.tag}>Announcement</div>
      <div>
        Currently powered by Helios Testnet (RPC:{" "}
        <a href="http://testnet1.helioschainlabs.org:8545/">
          testnet1.helioschainlabs.org:8545
        </a>
        )
      </div>
    </div>
  )
}

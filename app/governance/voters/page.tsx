import { DelegateCard } from "@/components/delegatecard"
import styles from "./voters.module.scss"

const links = [
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  },
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  },
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  },
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  },
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  },
  {
    url: "https://example.com",
    userid: "coby.eth",
    hasX: true,
    hasDiscord: true,
    label: "2.256M HEL   0% Participation",
    description:
      "The magnitude system allows governance participants to propose controlled adjustments to an asset's weight in the staking consensus. The magnitude level determines how much the asset’s weight will increase or decrease, directly impacting staking incentives and APY distribution."
  }
]

export default function VotersPage() {
  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {links.map((link, index) => (
          <DelegateCard key={index} link={link} />
        ))}
      </div>
    </div>
  )
}

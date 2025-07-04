import { Heading } from "@/components/heading"
import styles from "./MyProposals.module.scss"

interface Proposal {
  id: string
  title: string
  author: string
  status: string
  type: string
  waitingFor: string
  nextStep: string
}

const MyProposalCard: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
  <div className={styles.card}>
    <div className={styles.cardHeader}>
      <div>
        <h2 className={styles.proposalTitle}>
          {proposal.title || "Untitled proposal"}
        </h2>
        <p className={styles.proposalAuthor}>By {proposal.author}</p>
      </div>
      <span className={styles.badge}>Draft</span>
    </div>

    <div className={styles.cardMeta}>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>Type</div>
        <div className={styles.metaValue}>{proposal.type || "General"}</div>
      </div>
      <div className={styles.metaItem}>
        <div className={styles.metaLabel}>Status</div>
        <div className={styles.metaValue}>
          {proposal.waitingFor || "Awaiting submission"}
        </div>
      </div>
    </div>

    <div className={styles.progressSection}>
      <div className={styles.progressLabel}>Next start step</div>
      <div className={styles.progressBar}>
        <div className={styles.filled} />
      </div>
      <div className={styles.progressSteps}>
        <span className={styles.currentStep}>
          {proposal.nextStep || "Submit Draft"}
        </span>
        <span className={styles.upcomingStep}>Vote</span>
      </div>
    </div>

    <div className={styles.cardFooter}>
      <button className={styles.buttonOutline}>Edit Draft</button>
    </div>
  </div>
)

const MyProposals: React.FC = () => {
  const myProposal: Proposal = {
    id: "1",
    title: "WBTC Treasury Proposal",
    author: "0x80C72ec57e33DDF9fdEf9103F284394626a280D",
    status: "Draft",
    type: "[Type pending]",
    waitingFor: "Submitting draft",
    nextStep: "Submit Draft"
  }

  return (
    <div className={styles.myProposalsSection}>
      <Heading
        icon="material-symbols:note-add-outline"
        title="My Proposals"
        className={styles.sectionTitle}
      />
      <MyProposalCard proposal={myProposal} />
    </div>
  )
}

export default MyProposals

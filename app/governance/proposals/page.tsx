"use client"
import React, { useEffect, useRef, useState } from "react"
import { useAccount } from "wagmi"
import Link from "next/link"
import styles from "./page.module.scss"
import { fetchProposals } from "../../utils/api"

interface Proposal {
  id: string
  title: string
  author: string
  status: string
  type: string
  waitingFor: string
  nextStep: string
}

interface ProposalData {
  id: string
  meta: string
  status: string
  votes: string
  title: string
  result: string
  resultClass: string
  voteFor: string
  voteAgainst: string
}

const MyProposals: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
  <div className={styles.myProposalsSection}>
    <h1 className={styles.sectionTitle}>My Proposals</h1>

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
  </div>
)

interface ProposalData {
  id: string
  meta: string
  status: string
  votes: string
  title: string
  result: string
  resultClass: string
  voteFor: string
  voteAgainst: string
}

const AllProposals: React.FC = () => {
  const [proposals, setProposals] = useState<ProposalData[]>([])
  const [loading, setLoading] = useState(false)
  const pageRef = useRef(1)
  const loaderRef = useRef<HTMLDivElement | null>(null)
  const { isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleCreateProposal = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setShowModal(true)
    }, 1000)
  }

  const loadMoreProposals = async () => {
    if (loading) return
    const rawData = await fetchProposals(pageRef.current, 10)
    setLoading(false)
    if (!rawData || rawData.length === 0) {
      console.log("No more proposals to load")
      return
    }
    try {
      const newProposals: ProposalData[] = rawData.map((item: any) => {
        const yes = BigInt(item.finalTallyResult?.yes_count || "0")
        const no = BigInt(item.finalTallyResult?.no_count || "0")
        const total = yes + no || 1n
        const voteForPercent = Number((yes * 100n) / total)
        const voteAgainstPercent = 100 - voteForPercent

        return {
          id: item.id.toString(),
          meta: `By ${item.proposer}`,
          status: `Ends ${new Date(item.votingEndTime).toLocaleString()}`,
          votes: `${(yes / 10n ** 18n).toString()} For – ${(
            no /
            10n ** 18n
          ).toString()} Against`,
          title: item.title,
          result: item.status,
          resultClass:
            item.status === "PASSED" ? styles.executed : styles.defeated,
          voteFor: `${voteForPercent}%`,
          voteAgainst: `${voteAgainstPercent}%`
        }
      })

      setProposals((prev) => [...prev, ...newProposals])
      pageRef.current += 1
    } catch (error) {
      console.error("Failed to fetch proposals", error)
    }
    setLoading(true)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMoreProposals()
      },
      { threshold: 1 }
    )

    const current = loaderRef.current
    if (current) observer.observe(current)

    return () => {
      if (current) observer.unobserve(current)
    }
  }, [])

  return (
    <>
      <div className={styles["all-proposals"]}>
        <div className={styles.proposalContainer}>
          <h2 className={styles.sectionTitle}>All Proposals</h2>
          {isConnected && (
            <button
              className={styles["create-proposal"]}
              onClick={handleCreateProposal}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className={styles.myloader}></span>Loading…
                </>
              ) : (
                "Create Proposal"
              )}
            </button>
          )}
        </div>
        <div className={styles["proposal-list"]}>
          {proposals.map((proposal) => (
            <div
              key={proposal.id}
              className={`${styles["proposal-item"]} ${proposal.resultClass}`}
            >
              <Link href={`/governance/proposals/${proposal.id}`}>
                <div className={styles["proposal-details"]}>
                  <p className={styles.meta}>{proposal.meta}</p>
                  <p className={styles.status}>{proposal.status}</p>
                  <p className={styles.votes}>{proposal.votes}</p>

                  <h3 className={styles.title}>{proposal.title}</h3>
                  <p className={styles.result}>
                    <span className={proposal.resultClass}>
                      {proposal.result}
                    </span>
                  </p>
                  <div className={styles["vote-bar"]}>
                    <div
                      className={styles["vote-for"]}
                      style={{ width: proposal.voteFor }}
                    ></div>
                    <div
                      className={styles["vote-against"]}
                      style={{ width: proposal.voteAgainst }}
                    ></div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
          <div ref={loaderRef} className={styles.loader}>
            {loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
      {showModal && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowModal(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalLeft}>
              <div className={styles.padding1}>
                <p>Title *</p>
                <div className={styles.textInput}>
                  <input type="text" className={styles.customPadding}></input>
                </div>
                <p>Description *</p>
                <div className={styles.textArea}>
                  <textarea
                    className={styles.customPadding}
                    rows={13}
                  ></textarea>
                </div>
              </div>

              <div className={styles.line} />

              <div className={styles.padding1}>
                <p
                  className={`${styles.proposalTransactions} ${styles.fontBlack}`}
                >
                  Proposed transactions
                </p>
                <p className={`${styles.proposalTransactions} ${styles.mt1}`}>
                  Proposed transactions will execute after a proposal passes and
                  then gets executed.
                </p>
                <div className={styles.buttonRow}>
                  <button className={styles.primaryButton}>
                    Transfer from the treasury
                  </button>
                  <button className={styles.primaryButton}>
                    Create a custom transaction
                  </button>
                </div>
              </div>

              <div className={styles.line} />

              <div className={styles.padding1}>
                <div className={styles.createDraftBut}>
                  <div className={styles.customPadding}>Create Draft</div>
                </div>
              </div>
            </div>
            <div className={styles.modalRight}>
              <div className={styles.proposalChecklist}>
                <p className={styles.checklistTitle}>
                  <strong>Proposal checklist</strong>
                </p>
                <p>
                  <strong>1. Create your proposal</strong>
                </p>
                <p>
                  Get started by drafting your proposal directly in the
                  governance interface.
                </p>

                <p>
                  <strong>2. Request sponsorship (if threshold not met)</strong>
                </p>
                <p>
                  If you don&apos;t meet the required voting power threshold,
                  you can request sponsorship from existing delegates. This
                  allows your proposal to gain visibility and the necessary
                  backing from the community.
                </p>

                <p>
                  <strong>3. Submit as waiting for sponsorship</strong>
                </p>
                <p>
                  If you don&apos;t have the voting power to post the proposal
                  yourself, you can request a delegate with enough voting power
                  to sponsor it. The delegate you choose can review your
                  proposal and choose to sponsor it if they support it, pushing
                  it onchain for voting. One note - you should coordinate with
                  sponsor delegates so they know you&apos;re looking for
                  sponsorship!
                </p>

                <p>
                  <strong>4. Submit onchain (If threshold met)</strong>
                </p>
                <p>
                  If you meet the voting power threshold, you can bypass the
                  sponsorship phase and submit it onchain directly. This
                  fast-tracks your proposal to the voting stage, giving the
                  community the opportunity to decide on its implementation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const ProposalDashboard: React.FC = () => {
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
    <div className={styles.dashboard}>
      <MyProposals proposal={myProposal} />
      <AllProposals />
    </div>
  )
}

export default ProposalDashboard

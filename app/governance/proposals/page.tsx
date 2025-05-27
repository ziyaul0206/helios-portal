"use client"
import React, { useEffect, useRef, useState } from "react"
import styles from "./page.module.scss"

interface Proposal {
  id: string
  title: string
  author: string
  status: string
  type: string
  waitingFor: string
}

const MyProposals: React.FC<{ proposal: Proposal }> = ({ proposal }) => (
  <div>
    <h1 className={styles.dashboardTitle}>My proposals</h1>
    <div className={styles["proposal-card"]}>
      <p className={styles["proposal-author"]}>By {proposal.author}</p>
      <h2 className={styles["proposal-title"]}>{proposal.title}</h2>
      <div className={styles["proposal-meta"]}>
        <p>
          Status <span>{proposal.status}</span>
        </p>
        <p>
          Type <span>{proposal.type}</span>
        </p>
        <p>
          Waiting for <span>{proposal.waitingFor}</span>
        </p>
      </div>
      <div className={styles["proposal-steps"]}>
        <span>Create draft</span>
        <span>Submit draft</span>
        <span>Pending</span>
        <span>Queue</span>
        <span>Execute</span>
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

const initialProposals: ProposalData[] = [
  {
    id: "1",
    meta: "Standard Proposal by pgov.eth",
    status: "Ended 7:13 am May 18, 2025",
    votes: "24.65M For – 3.02K Against",
    title: "Scaling V4 and Supporting Unichain",
    result: "Defeated",
    resultClass: styles.defeated,
    voteFor: "89%",
    voteAgainst: "11%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  },
  {
    id: "2",
    meta: "Standard Proposal by pgov.eth",
    status: "Executed May 10, 2025 at 12:47 PM",
    votes: "43.67M For – 3K Against",
    title: "UAC Renewal S4",
    result: "Executed",
    resultClass: styles.executed,
    voteFor: "94%",
    voteAgainst: "6%"
  }
]

const AllProposals: React.FC = () => {
  const [proposals, setProposals] = useState(initialProposals)
  const [loading, setLoading] = useState(false)
  const loaderRef = useRef<HTMLDivElement | null>(null)

  // Simulate loading more proposals
  const loadMoreProposals = () => {
    if (loading) return

    setLoading(true)

    setTimeout(() => {
      const newProposal: ProposalData = {
        id: Math.random().toString(),
        meta: "Standard Proposal by anon.eth",
        status: "Ended 8:00 am May 19, 2025",
        votes: "30M For – 10K Against",
        title: "New Feature X",
        result: "Defeated",
        resultClass: styles.defeated,
        voteFor: "75%",
        voteAgainst: "25%"
      }

      setProposals((prev) => [...prev, newProposal])
      setLoading(false)
    }, 1000) // Simulated 1-second loading delay
  }
  // Infinite scroll observer
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
  }, [loading])

  return (
    <div className={styles["all-proposals"]}>
      <h2 className={styles.sectionTitle}>All Proposals</h2>
      <div className={styles["proposal-list"]}>
        {proposals.map((proposal) => (
          <div
            key={proposal.id}
            className={`${styles["proposal-item"]} ${proposal.resultClass}`}
          >
            <div className={styles["proposal-details"]}>
              <p className={styles.meta}>{proposal.meta}</p>
              <p className={styles.status}>{proposal.status}</p>
              <p className={styles.votes}>{proposal.votes}</p>

              <h3 className={styles.title}>{proposal.title}</h3>
              <p className={styles.result}>
                <span className={proposal.resultClass}>{proposal.result}</span>
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
          </div>
        ))}
        <div ref={loaderRef} className={styles.loader}>
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </div>
  )
}

const ProposalDashboard: React.FC = () => {
  const myProposal: Proposal = {
    id: "1",
    title: "[Title pending]",
    author: "0x80C72ec57e33DDF9fdEf9103F284394626a280D",
    status: "Draft",
    type: "[Type pending]",
    waitingFor: "Submitting draft"
  }

  return (
    <div className={styles.dashboard}>
      <MyProposals proposal={myProposal} />
      <AllProposals />
      {/* <button className={styles["create-proposal"]}>Create proposal</button> */}
    </div>
  )
}

export default ProposalDashboard

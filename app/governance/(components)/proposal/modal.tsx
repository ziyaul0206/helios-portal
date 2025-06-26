import { Button } from "@/components/button"
import { Input } from "@/components/input/input"
import { Select } from "@/components/input/select"
import { Message } from "@/components/message"
import { Modal } from "@/components/modal"
import { toast } from "sonner"
import s from "./proposal.module.scss"

interface ModalProposalProps {
  open: boolean
  onClose: () => void
}

export const ModalProposal = ({ open, onClose }: ModalProposalProps) => {
  const handleSubmit = () => {
    toast.success("Proposal submitted successfully")
    onClose()
  }

  return (
    <Modal
      title="Submit a Governance Proposal"
      className={s.modal}
      open={open}
      onClose={onClose}
      responsiveBottom
    >
      <Input
        icon="hugeicons:edit-02"
        label="Proposal Title"
        placeholder="Enter a clear & concise title"
      />
      <Select
        icon="hugeicons:list-setting"
        label="Proposal Type"
        options={[
          { value: "parameter-change", label: "Parameter Change" },
          { value: "asset-addition", label: "Asset Addition" },
          { value: "asset-weight-change", label: "Asset Weight Change" },
          { value: "text-proposal", label: "Text Proposal" },
          { value: "software-upgrade", label: "Software Upgrade" }
        ]}
      />
      <Input
        icon="hugeicons:ai-content-generator-01"
        type="textarea"
        label="Proposal Description"
        placeholder="Provide a detailed description of your proposal including rationale and expected impact."
      />
      <Input
        icon="helios"
        label="Initial Deposit (HLS)"
        type="number"
        value={100}
        min={100}
        helperText="Minimum deposit: 100 HLS. This deposit will be returned if the proposal reaches quorum."
      />
      <Message
        icon="hugeicons:information-circle"
        title="Important Information"
        className={s.message}
        variant="warning"
      >
        Once submitted, your proposal will be visible to all network
        participants and cannot be modified. Ensure all details are accurate and
        the description is clear before submitting.
      </Message>
      <div className={s.group}>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className={s.confirm}
          onClick={handleSubmit}
          icon="hugeicons:keyframes-double-add"
        >
          Submit Proposal
        </Button>
      </div>
    </Modal>
  )
}

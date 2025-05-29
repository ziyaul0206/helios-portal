export const STATUS_CONFIG = {
  passed: {
    color: "success",
    icon: "hugeicons:check-circle"
  },
  rejected: {
    color: "danger",
    icon: "hugeicons:close-circle"
  },
  active: {
    color: "primary",
    icon: "hugeicons:clock-circle"
  }
} as const

export const VOTE_CONFIG = {
  yes: {
    color: "success",
    icon: "hugeicons:thumbs-up"
  },
  no: {
    color: "danger",
    icon: "hugeicons:thumbs-down"
  },
  abstain: {
    color: "secondary",
    icon: "hugeicons:pause"
  },
  veto: {
    color: "warning",
    icon: "hugeicons:information-circle"
  }
} as const

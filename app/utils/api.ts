export const fetchProposals = async (page: number, pageSize: number) => {
  try {
    const response = await fetch("http://testnet1.helioschainlabs.org:8545/", {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_getProposalsByPageAndSize",
        params: [`0x${page.toString(16)}`, `0x${pageSize.toString(16)}`]
      })
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      throw new Error(data.error.message)
    }

    return data.result || []
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch proposals")
  }
}

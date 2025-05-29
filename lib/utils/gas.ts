export const getBestGasPrice = async (provider: any) => {
  try {
    const gasPrice = await provider.eth.getGasPrice()
    const gasPriceBigInt = BigInt(gasPrice)
    const tenPercent = (gasPriceBigInt * BigInt(10)) / BigInt(100)
    const gasWithTenPercent = gasPriceBigInt + tenPercent

    return gasWithTenPercent
  } catch (error) {
    console.error("Erreur lors du calcul du prix du gas:", error)
    throw error
  }
}

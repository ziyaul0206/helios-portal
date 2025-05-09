interface FormatCurrencyOptions {
  currency?: string
  small?: boolean
  tspan?: boolean
}

export const formatCurrency = (
  amount: number,
  options: FormatCurrencyOptions = {
    currency: "USD",
    small: true,
    tspan: false
  }
) => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount)

  const [wholePart, decimalPart] = formatted.split(".")
  const currencySymbol = options.currency === "USD" ? "$" : options.currency

  return (
    <>
      {currencySymbol}
      {wholePart}
      {options.small ? (
        <small>.{decimalPart}</small>
      ) : options.tspan ? (
        <tspan>.{decimalPart}</tspan>
      ) : (
        `.${decimalPart}`
      )}
    </>
  )
}

export function formatNumber(number: number, decimals?: number): string {
  const safeDecimals = Math.min(Math.max(decimals ?? 2, 0), 20)

  return number.toLocaleString("en-US", {
    maximumFractionDigits: safeDecimals,
    minimumFractionDigits: 2,
    useGrouping: true
  })
}

export const formatBigNumber = (number: number, toFixed = 2): string => {
  if (number < 1000) {
    return number.toFixed(toFixed)
  } else if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}k`
  } else if (number < 1000000000) {
    return `${(number / 1000000).toFixed(1)}M`
  } else {
    return `${(number / 1000000000).toFixed(1)}B`
  }
}

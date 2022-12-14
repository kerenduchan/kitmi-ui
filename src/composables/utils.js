function formatNumber(n) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n)
}

function formatDate(d) {
    return new Intl.DateTimeFormat('en-GB').format(d)
}

export {
    formatNumber,
    formatDate
}
function formatNumber(n) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n)
}

function formatDate(d) {
    return new Intl.DateTimeFormat('en-GB').format(d)
}

// given a string in the format YYYY-MM, return MM/YYYY
function formatMonthAndYear(date_str) {
    const year = date_str.substr(0, 4)
    const month = date_str.substr(5)
    return month + '/' + year
}


export {
    formatNumber,
    formatDate,
    formatMonthAndYear
}
function formatNumber(n, precisionDigits = 2) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: precisionDigits,
        maximumFractionDigits: precisionDigits,
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

function getChartColors() {
    return [
        '#005f73',
        '#001219',
        '#0a9396',
        '#94d2bd',
        '#ee9b00',
        '#ca6702',
        '#ae2012',
        '#9b2226',
        '#AE9E70',
        '#1F5D76',
        '#bb3e03',
    ]
}

function isReservedName(name) {
    return ['total', 'other', 'uncategorized'].includes(name.toLowerCase())
}

export {
    formatNumber,
    formatDate,
    formatMonthAndYear,
    getChartColors,
    isReservedName
}
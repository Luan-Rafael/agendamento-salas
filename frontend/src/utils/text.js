const THREEHOURSINMILLISECONDS = 60 * 1000 * 60 * 3

export function formatDateTimeToString(value) {
  const dateValue = new Date(value)

  const date = new Date(dateValue.getTime() - THREEHOURSINMILLISECONDS)

  const formatDate = date.toLocaleDateString('pt-BR')
  const formatHour = date.toLocaleTimeString('pt-BR', { hour12: false })

  return `${formatDate} ${formatHour}`
}

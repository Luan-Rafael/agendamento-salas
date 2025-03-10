export function formatDateTimeToString(value) {
    const date = new Date(value)

    const formatDate = date.toLocaleDateString('pt-BR');
    const formatHour = date.toLocaleTimeString('pt-BR', { hour12: false });

    return `${formatDate} ${formatHour}`
}
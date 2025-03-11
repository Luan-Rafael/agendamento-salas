const THREE_HOURS_IN_MILLISSECONDS = 1000 * 60 * 60 * 3

const rules = {
  userName: val => val && val.length > 6 || 'Nome obrigatório',
  email: (value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email obrigatório",
  required: val => !!val || "Campo obrigatório",
  minLenght: (val) => val && val.length >= 6 || 'Campo inválido',
  isDateTodayOrFuture: (value) => {
    const date = new Date(value)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return new Date(date.getTime() + THREE_HOURS_IN_MILLISSECONDS) >= today || 'A data deve ser hoje ou no futuro';
  },
  isTimeNowOrFuture: (value) => {
    const date = new Date()
    const dateValue = new Date();
    const [hour, minutes] = value.split(':')
    dateValue.setHours(hour, minutes) 
    return dateValue >= new Date(date.getTime()) || "A hora deve ser atual ou no futuro"
  }
}

export default rules

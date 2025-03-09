const rules = {
  userName: val => val && val.length > 6 || 'Nome obrigatório',
  email:(value) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value) || "Email obrigatório",
  required:  val => !!val || "Campo obrigatório",
  minLenght: (val)=>val && val.length >= 6 || 'Campo inválido',
}

export default rules

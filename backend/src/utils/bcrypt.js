import  bcrypt from 'bcrypt'

const saltRounds = 10;
  
export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Erro ao criptografar a senha');
    }
}
 
export async function validatePassword(password, hashedPassword) {
    try {
        const isMatch = await bcrypt.compare(password, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error('Erro ao validar a senha');
    }
}

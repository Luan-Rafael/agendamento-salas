import { execute, findAll } from "../db/exec.js"
import { ApiError } from "../utils/api-error.js"

export async function getRooms(_,response,next) {
    try {    
        const rooms = await findAll(`select * from rooms`)    

        response.json({rooms})       
    } catch (error) {
        next(error)        
    }
}

export async function createRoom(request,response,next) {
    const {name} = request.body
    try {    
        await execute(`insert into rooms (name), values (?);`, [name])

        response.status(201).send()       
    } catch (error) {
        next(error)        
    }
}

export async function updateRoom(request,response,next) {
    const {id} = request.params
    const {name} = request.body

    try {   
        if(!(id && name)) {
            throw new ApiError("Dados ausentes", 400)
        }

        const rooms = await findAll(`update set name = ? from rooms where id = ?`, [name, id])    

        response.json({rooms})       
    } catch (error) {
        next(error)        
    }
}
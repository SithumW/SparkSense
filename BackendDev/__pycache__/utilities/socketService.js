import io from 'socket.io-client'

const Socket_url = "http://192.168.56.1:5000"

class WSService {
    initializeSocket = async() =>{
        try{
            this.socket = io(Socket_url,{
                transports : ['websocket']

            })

            console.log("initializing socket", this.socket)
            this.socket.on('connect', (data)=>{
                console.log("==Socket Connected!")
            })

            this.socket.on('disconnect', (data)=>{
                console.log("==Socket Disconnected!")
            })

            this.socket.on('error', (data)=>{
                console.log("Socket Error!")
            })



        }catch(error){
            console.log("socket is not initialized", error)
        }
    }

    emit(event,data = {}){
        this.socket.emit(event,data)
    }

    
    on(event,data = {}){
        this.socket.on(event,cb)
    }

    
    removeListner(listnerName){
        this.socket.removeListner(listnerName)
    }

}

const socketServices = new WSService()
export default socketServices
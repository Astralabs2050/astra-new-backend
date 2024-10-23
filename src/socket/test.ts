export const test = (socket:any)=>{
    socket.on("test", async(data:any)=>{
        console.log("this is a test data",data)
    })
}
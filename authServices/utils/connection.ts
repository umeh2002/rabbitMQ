import amqp from "amqplib"
import { PrismaClient } from "@prisma/client"

const amqpServer = "amqp://localhost:5672"

const prisma = new PrismaClient()

const myConnection =async(queue:string)=>{
try {
  const connect =await amqp.connect(amqpServer)
  const channel =await connect.createChannel()

  await channel.assertQueue(queue)

  channel.consume(queue, async(message:any)=>{
    let res = JSON.parse(message.content.toString())


    const user:any = await prisma.authModel.findUnique({
      where:{id:res?.userID}
    })

    user?.store?.push(res)

    const product:any =await prisma.authModel.update({
      where:{id:res?.userID},
      data:{
        store:user?.store
      }
    })
    
  console.log(product)

  await channel.ack(message)
  })
} catch (error) {
  console.log("error")
}
}

export  {myConnection}

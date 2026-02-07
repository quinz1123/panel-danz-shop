import fetch from "node-fetch"

export default async function handler(req,res){

try{

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

const {username,token,ram}=req.body

if(!username) return res.json({error:"Username kosong"})
if(!ram) return res.json({error:"RAM kosong"})
if(token!=="Danz123") return res.json({error:"Token salah"})

const PANEL="https://private.ascentstore.web.id"
const PTLA="ptla_wRkvn4hvRpecDpsC8qY3IHOBaipqUDfBeewkIrE7Rde"

// ================= CREATE USER =================

const userReq = await fetch(PANEL+"/api/application/users",{
method:"POST",
headers:{
Authorization:`Bearer ${PTLA}`,
"Content-Type":"application/json",
Accept:"application/json"
},
body:JSON.stringify({
email:`${username}@gmail.com`,
username,
first_name:username,
last_name:"user",
password:username+"001"
})
})

const user = await userReq.json()

if(!user.attributes){
return res.json({error:user.errors?.[0]?.detail || "Create user gagal"})
}

const uid=user.attributes.id

// ================= CREATE SERVER =================

const serverReq=await fetch(PANEL+"/api/application/servers",{
method:"POST",
headers:{
Authorization:`Bearer ${PTLA}`,
"Content-Type":"application/json",
Accept:"application/json"
},
body:JSON.stringify({

name:username,
user:uid,
egg:19,

environment:{
CMD_RUN:"npm start"
},

limits:{
memory:Number(ram),
swap:0,
disk:0,
io:500,
cpu:0
},

feature_limits:{
databases:1,
allocations:1,
backups:1
},

deploy:{
locations:[1],
dedicated_ip:false,
port_range:[]
}

})
})

const server=await serverReq.json()

if(!server.attributes){
return res.json({error:server.errors?.[0]?.detail || "Create server gagal"})
}

return res.json({
success:true,
username,
password:username+"001",
server_id:server.attributes.id,
ram:ram+" MB"
})

}catch(e){
return res.json({error:e.message})
}

}
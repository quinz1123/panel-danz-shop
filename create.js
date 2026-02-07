import fetch from "node-fetch"

export default async function handler(req,res){

try{

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

const {username,token,ram}=req.body

if(!username) return res.json({error:"Username kosong"})
if(token!=="Danz123") return res.json({error:"Token salah"})

const PANEL="https://danz-tsuyoi.flixiazone.my.id"
const PTLA="ptla_HDoMsQBrkjxBYtS0ei6h4pV7NwBHPxZfqgmQBMeczbv"

// ================= CREATE USER =================

const userReq = await fetch(PANEL+"/api/application/users",{
method:"POST",
headers:{
"Authorization":`Bearer ${PTLA}`,
"Content-Type":"application/json",
"Accept":"application/json"
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
return res.json({
error:user.errors?.[0]?.detail || "Gagal create user"
})
}

const uid = user.attributes.id

// ================= CREATE SERVER =================

const serverReq = await fetch(PANEL+"/api/application/servers",{
method:"POST",
headers:{
"Authorization":`Bearer ${PTLA}`,
"Content-Type":"application/json",
"Accept":"application/json"
},
body:JSON.stringify({

name:username,
user:uid,
egg:15,
docker_image:"ghcr.io/pterodactyl/yolks:debian",
startup:"bash",

environment:{
CMD_RUN:"node index.js"   // FIX ERROR COMMAND RUN
},

limits:{
memory:Number(ram),
swap:0,
disk:0,
io:500,
cpu:0
},

feature_limits:{
databases:5,
backups:5,
allocations:1
},

deploy:{
locations:[1],
dedicated_ip:false,
port_range:[]
}

})
})

const server = await serverReq.json()

if(!server.attributes){
return res.json({
error:server.errors?.[0]?.detail || "Gagal create server"
})
}

return res.json({
success:true,
panel:PANEL,
username,
password:username+"001",
server_id:server.attributes.id,
ram:ram==0?"UNLIMITED":ram+" MB"
})

}catch(e){

return res.json({error:e.message})

}

}
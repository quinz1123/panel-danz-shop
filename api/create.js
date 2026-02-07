import fetch from "node-fetch"

export default async function handler(req,res){

try{

if(req.method !== "POST"){
return res.status(405).json({error:"Method not allowed"})
}

const { username, token, ram } = req.body

if(!username) return res.json({error:"Username kosong"})
if(!ram) return res.json({error:"RAM kosong"})
if(token !== "Danz123") return res.json({error:"Token salah"})

// ================= CONFIG =================

const PANEL = "https://private.ascentstore.web.id"
const PTLA = "ptla_wRkvn4hvRpecDpsC8qY3IHOBaipqUDfBeewkIrE7Rde"
const LOCATION = 1
const EGG = 15

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

const userText = await userReq.text()

let user
try{
user = JSON.parse(userText)
}catch{
return res.json({error:"User response bukan JSON"})
}

if(!user.attributes){
return res.json({error:userText})
}

const uid = user.attributes.id

// ================= CREATE SERVER =================

const serverReq = await fetch(PANEL+"/api/application/servers",{
method:"POST",
headers:{
Authorization:`Bearer ${PTLA}`,
"Content-Type":"application/json",
Accept:"application/json"
},
body:JSON.stringify({

name:username,
user:uid,
egg:EGG,
docker_image:"ghcr.io/pterodactyl/yolks:debian",
startup:"bash",

environment:{
CMD_RUN:"node index.js",
MAX_PLAYERS:"99999"
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
locations:[LOCATION],
dedicated_ip:false,
port_range:[]
}

})
})

// === SAFE RESPONSE ===

const serverText = await serverReq.text()

if(!serverText){
return res.json({
success:true,
note:"Server dibuat tapi panel tidak kirim response",
username,
password:username+"001"
})
}

let server
try{
server = JSON.parse(serverText)
}catch{
return res.json({error:"Server response bukan JSON"})
}

if(!server.attributes){
return res.json({error:serverText})
}

// ================= SUCCESS =================

return res.json({
success:true,
panel:PANEL,
username,
password:username+"001",
server_id:server.attributes.id,
ram:ram+" MB"
})

}catch(e){

return res.json({error:e.message})

}

}
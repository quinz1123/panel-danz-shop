import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import { getAuth,onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"
import { getFirestore,collection,query,where,getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js"

const firebaseConfig={
apiKey:"AIzaSyA2Eb7HpVNE7yPKsYxNqdCNs78qCkov62U",
authDomain:"danz-tsuyoi.firebaseapp.com",
projectId:"danz-tsuyoi"
}

const app=initializeApp(firebaseConfig)
const auth=getAuth(app)
const db=getFirestore(app)

const list=document.getElementById("list")

onAuthStateChanged(auth,async(user)=>{

if(!user) return location.replace("login.html")

const q=query(collection(db,"servers"),where("email","==",user.email))
const snap=await getDocs(q)

let html=""

snap.forEach(d=>{
const s=d.data()

html+=`
<div class="result-card">

<h3>${s.username}</h3>

<p>RAM: ${s.ram}</p>

<button class="action" onclick="window.open('${s.panel}')">LOGIN PANEL</button>

<button class="action dark" onclick="navigator.clipboard.writeText('${s.username}')">COPY USER</button>

<button class="action dark" onclick="navigator.clipboard.writeText('${s.password}')">COPY PASS</button>

</div>
`
})

list.innerHTML=html||"<p>Belum ada server</p>"

})
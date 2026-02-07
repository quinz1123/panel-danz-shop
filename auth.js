import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js"
import {
getAuth,
signInWithEmailAndPassword,
createUserWithEmailAndPassword,
onAuthStateChanged,
signOut,
sendEmailVerification,
GoogleAuthProvider,
signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js"

const firebaseConfig = {
apiKey: "AIzaSyA2Eb7HpVNE7yPKsYxNqdCNs78qCkov62U",
authDomain: "danz-tsuyoi.firebaseapp.com",
projectId: "danz-tsuyoi",
appId: "1:504620812619:web:02d66470fa3bed9fbfc0ce"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// ================= AUTO LOGIN CHECK =================

onAuthStateChanged(auth,user=>{

if(user){

// GOOGLE LOGIN = AUTO VERIFIED
if(user.providerData[0]?.providerId !== "google.com"){
if(!user.emailVerified){
alert("Verifikasi email dulu bro")
signOut(auth)
return
}
}

localStorage.setItem("logged","yes")

if(location.pathname.includes("login") || location.pathname.includes("register")){
setTimeout(()=>{
location.replace("/")
},300)
}

}else{
localStorage.removeItem("logged")
}

})

// ================= LOGIN EMAIL =================

window.login = function(){

const email = document.getElementById("email").value.trim()
const password = document.getElementById("password").value.trim()

if(!email || !password){
alert("Isi email dan password")
return
}

signInWithEmailAndPassword(auth,email,password)
.then(res=>{

if(res.user.providerData[0]?.providerId !== "google.com"){
if(!res.user.emailVerified){
alert("Email belum diverifikasi. Cek inbox!")
signOut(auth)
return
}
}

localStorage.setItem("logged","yes")

setTimeout(()=>{
location.replace("/")
},300)

})
.catch(e=>alert(e.message))

}

// ================= REGISTER + OTP =================

window.register = function(){

const email = document.getElementById("email").value.trim()
const password = document.getElementById("password").value.trim()

if(!email || !password){
alert("Lengkapi data")
return
}

if(password.length < 6){
alert("Password minimal 6 karakter")
return
}

createUserWithEmailAndPassword(auth,email,password)
.then(async(res)=>{

await res.user.reload()
await sendEmailVerification(res.user)

alert("OTP sudah dikirim ke email. Silakan cek inbox / spam!")

location.replace("login.html")

})
.catch(e=>alert(e.message))

}

// ================= GOOGLE LOGIN =================

window.googleLogin = function(){

const provider = new GoogleAuthProvider()

signInWithPopup(auth,provider)
.then(()=>{

localStorage.setItem("logged","yes")
location.replace("/")

})
.catch(e=>alert(e.message))

}

// ================= LOGOUT =================

window.logout = function(){

signOut(auth).then(()=>{
localStorage.removeItem("logged")
location.replace("login.html")
})

}
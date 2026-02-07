await new Promise(r=>setTimeout(r,300))

if(!localStorage.getItem("logged")){
location.replace("login.html")
}
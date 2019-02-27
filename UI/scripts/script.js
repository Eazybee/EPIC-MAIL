window.onload= function ready(){
    if( document.querySelector("#signOutLink")){ //If on home page -> index.html
        document.querySelector("#signOutLink").onclick= (e) => {
            document.querySelector(".signIn").classList.add("hidden");
            document.querySelector(".signOut").classList.remove("hidden");
        }
        document.querySelector("#signInLink").onclick= (e) => {
            document.querySelector(".signOut").classList.add("hidden");
            document.querySelector(".signIn").classList.remove("hidden");
        }
    }
}
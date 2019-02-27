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
    if(document.querySelector("a[href='#Inbox']")){ //if on dashboard page -> inbox.html
        /** Right-panel-Menus Event **/
        document.querySelector("a[href='#Inbox']").onclick = (event) => {
            document.querySelector(".right-inbox ").classList.remove("hidden");
            document.querySelector(".view-message").classList.add("hidden");
           
        }
        
        document.querySelectorAll(".inbox .bottom .inbox-view >div >*:not(input)").forEach((element) => {
            element.onclick = (event) => {
                document.querySelector(".right-inbox ").classList.add("hidden");
                document.querySelector(".view-message").classList.remove("hidden");
            }
        })
        

    }
}
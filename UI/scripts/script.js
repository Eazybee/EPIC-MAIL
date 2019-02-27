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
            document.querySelector(".right-compose").classList.add("hidden");
            document.querySelector(".right-sent").classList.add("hidden");
            
            document.querySelector("a[href='#Inbox']").classList.add('active');
            document.querySelector("a[href='#Compose']").classList.remove('active');
            document.querySelector("a[href='#Sent']").classList.remove('active');
        }
        document.querySelector("a[href='#Compose']").onclick = (event) =>{
            document.querySelector(".right-compose").classList.remove("hidden");
            document.querySelector(".right-inbox ").classList.add("hidden");
            document.querySelector(".view-message").classList.add("hidden");
            document.querySelector(".right-sent").classList.add("hidden");
            
            document.querySelector("a[href='#Inbox']").classList.remove('active');
            document.querySelector("a[href='#Compose']").classList.add('active');
            document.querySelector("a[href='#Sent']").classList.remove('active');
        }
        document.querySelector("a[href='#Sent']").onclick = (event) =>{
            document.querySelector(".right-compose").classList.add("hidden");
            document.querySelector(".right-inbox ").classList.add("hidden");
            document.querySelector(".view-message").classList.add("hidden");
            document.querySelector(".right-sent").classList.remove("hidden");
            
            document.querySelector("a[href='#Inbox']").classList.remove('active');
            document.querySelector("a[href='#Compose']").classList.remove('active');
            document.querySelector("a[href='#Sent']").classList.add('active');
        }
        
        document.querySelectorAll(".inbox .inbox-view >div >*:not(input), .inbox .right-sent >div >*:not(input)").forEach((element) => {
            element.onclick = (event) => {
                document.querySelector(".right-inbox ").classList.add("hidden");
                document.querySelector(".right-compose").classList.add("hidden");
                document.querySelector(".right-sent").classList.add("hidden");
                document.querySelector(".view-message").classList.remove("hidden");
            }
        })
        
        document.querySelector("[name='sendMail']").onsubmit = (event) => {
            let sendButton = document.querySelector("[name='sendMail'] button");
            sendButton.innerHTML = 'SENDING';
            sendButton.classList.add("sending");
            
            setTimeout(() => {
                sendButton.innerHTML = "SENT";
                sendButton.classList.add("sent");
            }, 2000);
            setTimeout(() => {
                
                sendButton.innerHTML = "SEND"
                sendButton.classList.remove("sending");
                sendButton.classList.remove("sent");
                document.querySelector("[name='sendMail']").reset();
            }, 3000);
            
            return false;
        }

    }
    
};
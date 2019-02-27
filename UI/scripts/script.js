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
        /** ALert box Event hanler**/
        document.querySelector(".alert .title-bar a").onclick = (event) => {
            
            document.querySelectorAll(".modal, .alert").forEach((element) => {
                element.classList.add("hidden");
            });
        }
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
        
        document.querySelectorAll(".inbox .inbox-view >div >*:not(input)").forEach((element) => {
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

        document.querySelector("#retract").onclick = (event) => { 
            document.querySelectorAll(".inbox .bottom .right-sent .inbox-view >div >input").forEach((element) => {
                
                if(element.checked){
                    
                   let mailID ="#s" + element.value; 
                    alertMessage("Mail Retracted Successfully");
                    document.querySelector(mailID).classList.add("hidden");
                   
                }
            });
        }
        
        document.querySelectorAll(".inbox .right-compose .address span input[type='radio']").forEach((radioButton) => {
            radioButton.onclick = (event) => {
                let selectedRadioValue = radioButton.value;
                let inputEmail = document.querySelector(".inbox .right-compose .address input[type='email']");
                let selectGroup = document.querySelector(".inbox .right-compose .address select");
                if(selectedRadioValue == "Individual"){
                    inputEmail.classList.remove("hidden");
                    inputEmail.required=true;
                    selectGroup.required=false;
                    selectGroup.classList.add("hidden");
                    
                }else if(selectedRadioValue == "Group"){
                    inputEmail.classList.add("hidden");
                    inputEmail.required=false;
                    selectGroup.required=true;
                    selectGroup.classList.remove("hidden");
                    
                    (() => {
                        selectGroup.innerHTML="<option disabled selected value='0'>Select Group</option>";
                        document.querySelectorAll(".inbox .bottom ul.groups ul li a").forEach((element) => {
                            
                            let name =element.innerHTML.split("»")[1];
                            let option = document.createElement('option'); //create an option element(tag)
                            let groupName = document.createTextNode(name); //create a textnode 
                            option.appendChild(groupName); 			//add text to option tag created
                            selectGroup.appendChild(option);	//add option to Select element
                        })
                        
                    })();
                }
            }
        });
    }
    
};

function alertMessage(message){
    document.querySelector(".alert p").innerHTML=message;
    document.querySelectorAll(".modal, .alert").forEach((element) => {
                element.classList.remove("hidden");
            });
}
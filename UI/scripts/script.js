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
        
        /** Left-panel-Menus Event **/
        document.querySelector("a[href='#Inbox']").onclick = (event) => {
            
            document.querySelectorAll(".right:not(.right-inbox)").forEach((element) => {
                element.classList.add("hidden");
            });
            document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Inbox'])").forEach((element) => {
                element.classList.remove('active');
            });
            document.querySelector("a[href='#Inbox']").classList.add('active');
            document.querySelector(".right-inbox").classList.remove("hidden");
        }
        document.querySelector("a[href='#Compose']").onclick = (event) => {
            document.querySelectorAll(".right:not(.right-compose)").forEach((element) => {
                element.classList.add("hidden");
            });
            document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Compose'])").forEach((element) => {
                element.classList.remove('active');
            });
            document.querySelector("a[href='#Compose']").classList.add('active');
            document.querySelector(".right-compose").classList.remove("hidden");
        }
        document.querySelector("a[href='#Sent']").onclick = (event) => {
            document.querySelectorAll(".right:not(.right-sent)").forEach((element) => {
                element.classList.add("hidden");
            });
            document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Sent'])").forEach((element) => {
                element.classList.remove('active');
            });
            document.querySelector("a[href='#Sent']").classList.add('active');
            document.querySelector(".right-sent").classList.remove("hidden");
        }
        document.querySelector("a[href='#Draft']").onclick = (event) => {
            document.querySelectorAll(".right:not(.right-draft)").forEach((element) => {
                element.classList.add("hidden");
            });
            document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Draft'])").forEach((element) => {
                element.classList.remove('active');
            });
            document.querySelector("a[href='#Draft']").classList.add('active');
            document.querySelector(".right-draft").classList.remove("hidden");
        }
        
        document.querySelectorAll(".right:not(.right-draft) .inbox-view >div >*:not(input)").forEach((element) => {
            element.onclick = (event) => {
                document.querySelector(".right-inbox ").classList.add("hidden");
                document.querySelector(".right-compose").classList.add("hidden");
                document.querySelector(".right-sent").classList.add("hidden");
                document.querySelector(".view-message").classList.remove("hidden");
            }
        })
        
        /** Send mail **/
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
                        selectGroup.innerHTML="<option disabled selected value=''>Select Group</option>";
                        document.querySelectorAll(".inbox .bottom ul.groups ul li a").forEach((element) => {
                            
                            let name =element.innerHTML.split("» ")[1];
                            let option = document.createElement('option'); //create an option element(tag)
                            let groupName = document.createTextNode(name); //create a textnode 
                            option.appendChild(groupName); 			//add text to option tag created
                            option.setAttribute("value", name); //set value = name
                            selectGroup.appendChild(option);	//add option to Select element
                        })
                        
                    })();
                }
            }
        });
        
        /** Save mail as draft **/
        document.querySelector("#saveMail").onclick = (event) => {
            let topic = document.querySelector('.inbox .right-compose .message input').value;
            let msgBody = document.querySelector('.inbox .right-compose .message textarea').value;
            let mailTo ="" ;
            if(topic.trim() == "" && msgBody.trim() == ""){
                alertMessage("Both subject and message body cannot be empty");
            }else{
                document.querySelectorAll(".inbox .right-compose .address span input[type='radio']").forEach((radioButton) => {
                   if(radioButton.checked && radioButton.value == "Individual" ){
                       mailTo = document.querySelector(".inbox .right-compose .address input[type='email']").value;
                   }
                    else if(radioButton.checked && radioButton.value == "Group" ){
                        let selectElement = document.querySelector(".inbox .right-compose .address select");
                        let selectedIndex = selectElement.selectedIndex; //geting index of selected option
                        let options = selectElement.options; //getting collections of all options as an array
                        mailTo = options[selectedIndex].value; //returning the value of selected option
                   }
                });
                
                let divElement = document.createElement('div');
                divElement.innerHTML ='<input type="checkbox" value="1">'+
                                    '<p>'+mailTo+'</p>'+
                                    '<div>'+
                                        '<p class="subject">'+topic+'</p>'+
                                        '<p class="msg">s'+msgBody+'</p>'+
                                    '</div>'+
                                    '<label>'+new Date().getDate()+'-'+new Date().getMonth()+'</label>';
            
                document.querySelector('.right-draft .inbox-view').appendChild(divElement);
                alertMessage("Message saved as draf succesfully");
            }
            
        }

        /** Retract a sent mail **/
        document.querySelector("#retract").onclick = (event) => { 
            document.querySelectorAll(".inbox .bottom .right-sent .inbox-view >div >input").forEach((element) => {
                
                if(element.checked){
                    
                   let mailID =".right-sent .inbox-view  .s" + element.value; 
                    alertMessage("Mail Retracted Successfully");
                    document.querySelector(mailID).classList.add("hidden");
                    
                   
                }
            });
        }
        
        /** Delete draft **/
        document.querySelector(".right-draft .toolbar button.deleteButton").onclick = (event) => {
            document.querySelectorAll(".inbox .bottom .right-draft .inbox-view >div >input").forEach((element) => {
                
                if(element.checked){
                    
                   let mailID =".right-draft .inbox-view .s" + element.value; 
                    alertMessage("Draft Mail Deleted Successfully");
                    document.querySelector(mailID).classList.add("hidden");
                   
                }
            });
        }
    }
    
};

function alertMessage(message){
    document.querySelector(".alert p").innerHTML=message;
    document.querySelectorAll(".modal, .alert").forEach((element) => {
                element.classList.remove("hidden");
            });
}
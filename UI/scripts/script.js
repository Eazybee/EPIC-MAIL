window.onload= function ready() {
    if( document.querySelector(".signUpLink")) { //If on home page -> index.html
        document.querySelectorAll(".signUpLink").forEach((element) => {
            element.onclick= (event) => {
                document.querySelector(".signIn").classList.add("hidden");
                document.querySelector(".reset").classList.add("hidden");
                document.querySelector(".signUp").classList.remove("hidden");
            }
        });
        document.querySelectorAll(".signInLink").forEach((element) => {
            element.onclick= (e) => {
                document.querySelector(".reset").classList.add("hidden");
                document.querySelector(".signUp").classList.add("hidden");
                document.querySelector(".signIn").classList.remove("hidden");
            }
        });
        document.querySelectorAll(".resetLink").forEach((element) => {
            element.onclick= (e) => {
                document.querySelector(".reset").classList.remove("hidden");
                document.querySelector(".signUp").classList.add("hidden");
                document.querySelector(".signIn").classList.add("hidden");
            }
        });
        
        //RESET FORM
        document.querySelector("#resetForm").onsubmit = (event) => {
            let email = document.querySelector("#resetForm input[type='email']");
            let answer = document.querySelector("#resetForm input[type='text']");
            let password = document.querySelector("#resetForm input[type='password']");
            if(email.value.trim() =="") {
                alertMessage("Please enter your Email address");
            }else{
                
                document.querySelector("#resetForm .answer").classList.remove("hidden");
                document.querySelector("#resetForm .question").classList.remove("hidden");
                
                if(answer.value.trim() != "") {
                    document.querySelector("#resetForm .password").classList.remove("hidden");
                    if(password.value.trim() != "") {
                        alertMessage("Password Reset Succesfully ")
                        email.value="";
                        answer.value="";
                        password.value="";
                        setTimeout(() =>{ location.reload()},3000);
                    }
                }
                
            }
            return false;
        }
        
        //SIGN-IN FORM
        document.querySelector("#signInForm").onsubmit = (event) => { 
            let email = document.querySelector("#signInForm input[type='email']");
            let password = document.querySelector("#signInForm input[type='password']");
            
            if(email.value.trim() == "") {
                email.value = "";
                alertMessage("Enter email address");
            }
            else if(password.value.trim() == "") {
                password.value = "";
                alertMessage("Enter Password");
            }
            else {
                email.value = "";
                password.value = "";
                alertMessage("Login Successful");
            }
            return false;    
        }
        
        //SIGNUP FORM
        document.querySelector("#signUpForm").onsubmit = (event) => {
            let password = document.querySelector("#signUpForm #password");
            let rePassword = document.querySelector("#signUpForm #rePassword");
            if(password.value != rePassword.value){
                alertMessage("Password do no match");
            }
            else{
                document.querySelector("#signUpForm")
                alertMessage("Registration Sucessful!");
                setTimeout(() =>{ location.reload()},2000);
            }
            return false;
        }
        
    }
    if(document.querySelector("a[href='#Inbox']")) { //if on dashboard page -> inbox.html
        
        
        //delete mail
        const deleteMail = (mailID, respondMessage="") => {
            document.querySelector(mailID).classList.add("hidden");
            if(respondMessage != "") { 
                alertMessage(respondMessage);
            }
        }
        
        //Show Compose Panel
        const showCompose = () => {
            document.querySelectorAll(".right:not(.right-compose)").forEach((element) => {
                element.classList.add("hidden");
            });
            document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Compose'])").forEach((element) => {
                element.classList.remove('active');
            });
            document.querySelector("a[href='#Compose']").classList.add('active');
            document.querySelector(".right-compose").classList.remove("hidden");
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
            showCompose();
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
        document.querySelector("a[href='#Group']").onclick = (event) => {
            if(document.querySelector(".inbox > input[type='hidden']").value == "Admin") {
                document.querySelectorAll(".right:not(.right-group)").forEach((element) => {
                    element.classList.add("hidden");
                });
                document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Group'])").forEach((element) => {
                    element.classList.remove('active');
                });
                document.querySelector("a[href='#Group']").classList.add('active');
                document.querySelector(".right-group").classList.remove("hidden");
            }else{
                alertMessage("Only an Admin is allowed to create group");
            }
        }
        
        //veiw Message
        
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
            radioButton.onchange = (event) => {
                let selectedRadioValue = radioButton.value;
                let inputEmail = document.querySelector(".inbox .right-compose .address input[type='email']");
                let selectGroup = document.querySelector(".inbox .right-compose .address select");
                if(selectedRadioValue == "Individual") {
                    inputEmail.classList.remove("hidden");
                    inputEmail.required=true;
                    selectGroup.classList.add("hidden");
                    
                }else if(selectedRadioValue == "Group") {
                    inputEmail.classList.add("hidden");
                    inputEmail.required=false;
                    selectGroup.classList.remove("hidden");
                    
                    (() => {
                        selectGroup.innerHTML="<option disabled selected value=''>Select Group</option>";
                        document.querySelectorAll(".inbox .bottom li.groups  li a").forEach((element) => {
                            
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
        
        /** Retract a sent mail **/
        document.querySelector("#retract").onclick = (event) => { 
            document.querySelectorAll(".inbox .bottom .right-sent .inbox-view >div >input").forEach((element) => {
                
                if(element.checked) {
                    
                   let mailID =".right-sent .inbox-view  .s" + element.value; 
                    alertMessage("Mail(s) Retracted Successfully");
                    document.querySelector(mailID).classList.add("hidden");
                    
                   
                }
            });
        }
        
        /** Save mail as draft **/
        document.querySelector("#saveMail").onclick = (event) => {
            let topic = document.querySelector('.inbox .right-compose .message input').value;
            let msgBody = document.querySelector('.inbox .right-compose .message textarea').value;
            let mailTo ="" ;
            let mailToType="";
            let mailID="";
            if(topic.trim() == "" && msgBody.trim() == "") {
                alertMessage("Both subject and message body cannot be empty");
            }else{
                document.querySelectorAll(".inbox .right-compose .address span input[type='radio']").forEach((radioButton) => {
                   if(radioButton.checked && radioButton.value == "Individual" ) {
                       mailTo = document.querySelector(".inbox .right-compose .address input[type='email']").value;
                       mailToType = "Individual";
                   }
                    else if(radioButton.checked && radioButton.value == "Group" ) {
                        let selectElement = document.querySelector(".inbox .right-compose .address select");
                        let selectedIndex = selectElement.selectedIndex; //geting index of selected option
                        let options = selectElement.options; //getting collections of all options as an array
                        mailTo = options[selectedIndex].value; //returning the value of selected option
                        mailToType = "Group";
                   }
                    
                });
                mailID = document.querySelector(".right-draft .inbox-view >div:last-child input") != null ?parseInt(document.querySelector(".right-draft .inbox-view >div:last-child input").value) +1 : 0;
        
                let divElement = document.createElement('div');
                divElement.innerHTML ='<input type="hidden" value="'+mailToType+'">'+
                                    '<input type="checkbox" value="'+mailID+'">'+
                                    '<p>'+mailTo+'</p>'+
                                    '<div>'+
                                        '<p class="subject">'+topic+'</p>'+
                                        '<p class="msg">s'+msgBody+'</p>'+
                                    '</div>'+
                                    '<label>'+new Date().getDate()+'-'+new Date().getMonth()+'</label>';
                divElement.setAttribute("class","s"+mailID);            
                document.querySelector('.right-draft .inbox-view').appendChild(divElement);
                alertMessage("Message saved as draft succesfully");
                document.querySelector("[name='sendMail']").reset();
            }
            
        }

        /**Send Draft Message **/
        const sendDraftMessage = (mailDiv) => {
            let mailID = ".right-draft .inbox-view .s" + mailDiv.querySelector("input[type='checkbox']").value;
            let mailToType  = mailDiv.querySelector("input[type='hidden']").value;
            let mailTo = mailDiv.querySelector("p").innerHTML;
            let mailSubject = mailDiv.querySelector("div .subject").innerHTML;
            let mailBody = mailDiv.querySelector("div .msg").innerHTML;
            
            document.querySelector(".right-compose .address input[type='radio'][value='"+mailToType+"']").checked = true;
            if(mailToType == "Individual") {
                document.querySelector(".right-compose .address input[type='email']").value = mailTo;
                document.querySelector(".right-compose .address input[type='email']").classList.remove("hidden");
                document.querySelector(".right-compose .address input[type='email']").required=true;
                document.querySelector(".right-compose .address select").classList.add("hidden");
            }
            else if(mailToType == "Group") {
                let selectGroup = document.querySelector(".right-compose .address select");
               
                document.querySelector(".right-compose .address input[type='email']").classList.add("hidden");
                document.querySelector(".right-compose .address input[type='email']").required=false;
                selectGroup.classList.remove("hidden");
                
                (() => {
                        selectGroup.innerHTML="<option disabled selected value=''>Select Group</option>";
                        document.querySelectorAll(".inbox .bottom li.groups  li a").forEach((element) => {
                            
                            let name =element.innerHTML.split("» ")[1];
                            let option = document.createElement('option'); //create an option element(tag)
                            let groupName = document.createTextNode(name); //create a textnode 
                            option.appendChild(groupName); 			//add text to option tag created
                            option.setAttribute("value", name); //set value = name
                            selectGroup.appendChild(option);	//add option to Select element
                        })
                        
                    })();
                 selectGroup.value = mailTo;
            }
            document.querySelector(".right-compose .message input[type='text']").value = mailSubject;
            document.querySelector(".right-compose .message textarea").value = mailBody;
            deleteMail(mailID);
            showCompose();
            //alertMessage(mailBody);   
        }
        // EVENT DELEGATION 
        document.addEventListener('click',function(e) {
            if(e.target  && Array.from(document.querySelectorAll(".right-draft .inbox-view >div >*:not(input)")).includes(e.target)) {
                let mailDiv = e.target.parentNode;
                sendDraftMessage(mailDiv);
            }
        });
        document.addEventListener('click',function(e) {
            if(e.target  && Array.from(document.querySelectorAll(".right-draft .inbox-view >div div p")).includes(e.target)) {
                let mailDiv = e.target.parentNode.parentNode;
                sendDraftMessage(mailDiv);
            }
        });
        
        /** Delete draft **/
        document.querySelector(".right-draft .toolbar button.deleteButton").onclick = (event) => {
            document.querySelectorAll(".inbox .bottom .right-draft .inbox-view >div >input").forEach((element) => {
                
                if(element.checked) {       
                    let mailID =".right-draft .inbox-view .s" + element.value; 
                    deleteMail(mailID,"Draft Mail(s) Deleted Successfully")
                }
            });
        }
        /** CREATE GROUP**/
        document.querySelector(".right-group #addMember").onsubmit = (event) => {
            let email = document.querySelector(".right-group input[type='email']");
            if( email.value.trim() != "") {
                let list = document.createElement("li");
                list.innerHTML= email.value;
                document.querySelector(".right-group ul").appendChild(list);
                email.value="";
            }
            return false;
        }
        document.querySelector(".right-group #createGroup").onsubmit = (event) => {
            let groupName = document.querySelector(".right-group input[type='text']");
            if( groupName.value.trim() != "") {
                let groupMember = document.querySelector(".right-group ul li") != null ? true : false ;
                if(groupMember) {
                    
                    document.querySelector(".right-group ul ").innerHTML="";
                    let li = document.createElement("li");
                    li.innerHTML="<a href='#'>&raquo; "+groupName.value+"</a>"
                    document.querySelector(".inbox .bottom li.groups ul").appendChild(li);
                    groupName.value="";
                    alertMessage('Group Created Successfully!')
                }
                else{
                    alertMessage("Cannot create an empty group!")
                }
            }else{
                alertMessage("Group Name cannot be empty")
            }
            return false;
        }
    }
    
    /** ALert box Event handler**/
    document.querySelector(".alert .title-bar a").onclick = (event) => {
            
        document.querySelectorAll(".modal, .alert").forEach((element) => {
            element.classList.add("hidden");
        });
    }
    function alertMessage(message) {
        document.querySelector(".alert p").innerHTML=message;
        document.querySelectorAll(".modal, .alert").forEach((element) => {
            element.classList.remove("hidden");
        });
    }
};


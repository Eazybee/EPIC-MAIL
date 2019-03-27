window.onload = function ready() {
  // Code template credit to Mozila: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
// Example POST method implementation:

  const postData = async (method = 'GET', path, data, auth) => {
    if (!path) {
      throw new Error('Path not defined!');
    }
    const url = `http://localhost:3000/api/v1${path}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (auth) {
      headers.append('authorization', localStorage.getItem('auth'));
    }
    const init = {
      method, // *GET, POST, PUT, DELETE, etc.
      headers,
    };

    if (data) {
      init.body = JSON.stringify(data);// body data type must match "Content-Type" header
    }

    const result = await fetch(url, init).then(response => response);

    return result;
  };
  const logOut = () => {
    localStorage.removeItem('auth');
    window.location.replace('./loginPage.html');
  };

  const alertMessage = (message) => {
    document.querySelector('.alert p').innerHTML = message;
    document.querySelectorAll('.modal, .alert').forEach((element) => {
      element.classList.remove('hidden');
    });
  };
  const loadGroup = () => {
    const selectGroup = document.querySelector('.inbox .right-compose .address select');
    selectGroup.innerHTML = "<option disabled selected value=''>Select Group</option>";
    document.querySelectorAll('.right-group .groups div a').forEach((element) => {
      const name = element.innerHTML;
      const option = document.createElement('option'); // create an option element(tag)
      const groupName = document.createTextNode(name); // create a textnode
      option.appendChild(groupName); // add text to option tag created
      option.setAttribute('value', name); // set value = name
      selectGroup.appendChild(option); // add option to Select element
    });
  };
  if (document.querySelector('.slider')) { // landing Page
    document.querySelector('.log-in').onclick = () => {
      window.location.href = './pages/loginPage.html';
    };
  } else {
    /** ALert box Event handler* */
    document.querySelector('.alert .title-bar a').onclick = () => {
      document.querySelectorAll('.modal, .alert').forEach((element) => {
        element.classList.add('hidden');
      });
    };
  }

  if (document.querySelector('.signUpLink')) { // loginPage.html
    /** Home Page Traverse Code * */
    document.querySelectorAll('.resetLink, .signUpLink, .signInLink').forEach((element) => {
      const elem = element;
      elem.onclick = () => {
        const formSelector = `.${String(element.classList).split('Link')[0]}`;
        document.querySelector(formSelector).classList.remove('hidden');
        document.querySelectorAll(`.sign:not(${formSelector})`).forEach((ele) => {
          ele.classList.add('hidden');
        });
      };
    });

    // RESET FORM
    document.querySelector('#resetForm').onsubmit = () => {
      const email = document.querySelector("#resetForm input[type='email']");
      const answer = document.querySelector("#resetForm input[type='text']");
      const password = document.querySelector("#resetForm input[type='password']");
      if (email.value.trim() === '') {
        alertMessage('Please enter your Email address');
      } else {
        document.querySelector('#resetForm .answer').classList.remove('hidden');
        document.querySelector('#resetForm .question').classList.remove('hidden');

        if (answer.value.trim() !== '') {
          document.querySelector('#resetForm .password').classList.remove('hidden');
          if (password.value.trim() !== '') {
            alertMessage('Password Reset Succesfully ');
            email.value = '';
            answer.value = '';
            password.value = '';
            setTimeout(() => { window.location.reload(); }, 3000);
          }
        }
      }
      return false;
    };

    // SIGN-IN FORM
    document.querySelector('#signInForm').onsubmit = () => {
      const email = document.querySelector("#signInForm input[type='email']");
      const password = document.querySelector("#signInForm input[type='password']");

      if (email.value.trim() === '') {
        email.value = '';
        alertMessage('Enter email address');
      } else if (password.value.trim() === '') {
        password.value = '';
        alertMessage('Enter password');
      } else {
        const obj = {
          email: email.value,
          password: password.value,
        };
        postData('POST', '/auth/login', obj)
          .then(async (response) => {
            const res = await response.json();
            email.value = '';
            password.value = '';
            if ('error' in res) {
              throw new Error(res.error);
            }
            if ('data' in res && 'token' in res.data[0]) {
              localStorage.setItem('auth', res.data[0].token);
              alertMessage('Login Successful');
              window.location.href = './inbox.html';
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      }
      return false;
    };

    // SIGNUP FORM
    document.querySelector('#signUpForm').onsubmit = () => {
      const password = document.querySelector('#signUpForm #password');
      const rePassword = document.querySelector('#signUpForm #rePassword');
      if (password.value !== rePassword.value) {
        alertMessage('Password do no match');
      } else {
        const signUpForm = document.querySelector('#signUpForm');
        const obj = {
          firstName: signUpForm.signupFirstName.value,
          email: signUpForm.signupEmail.value,
          password: signUpForm.signupPassword.value,
          rePassword: signUpForm.signupRePassword.value,
        };
        postData('POST', '/auth/signup', obj)
          .then(async (response) => {
            const res = await response.json();
            signUpForm.signupFirstName.value = '';
            signUpForm.signupEmail.value = '';
            signUpForm.signupPassword.value = '';
            signUpForm.signupRePassword.value = '';
            if ('error' in res) {
              throw new Error(res.error);
            }
            if ('data' in res && 'token' in res.data[0]) {
              alertMessage('Account created Succesful!');
              window.location.reload();
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      }
      return false;
    };
  }

  if (document.querySelector("a[href='#Inbox']")) { // if on dashboard page -> inbox.html
    // Check if user is logged in
    if (!localStorage.getItem('auth')) {
      window.location.replace('./loginPage.html');
    }
    //  Menu buttons
    const inBtn = document.querySelector('.seek button.in');
    const outBtn = document.querySelector('.seek button.out');
    const menu = document.querySelector('.inbox .bottom .left');

    inBtn.onclick = () => {
      menu.classList.remove('show');
      inBtn.classList.add('hidden');
      outBtn.classList.remove('hidden');
    };
    outBtn.onclick = () => {
      menu.classList.add('show');
      inBtn.classList.remove('hidden');
      outBtn.classList.add('hidden');
    };

    // delete mail
    const deleteMail = (mailID, respondMessage = '') => {
      document.querySelector(mailID).classList.add('hidden');
      if (respondMessage !== '') {
        alertMessage(respondMessage);
      }
    };

    // Show Compose Panel
    const showCompose = () => {
      document.querySelectorAll('.right  > div:not(.right-compose)').forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Compose'])").forEach((element) => {
        element.classList.remove('active');
      });
      document.querySelector("a[href='#Compose']").classList.add('active');
      document.querySelector('.right-compose').classList.remove('hidden');
    };

    /** Left-panel-Menus Event * */
    document.querySelector("a[href='#Inbox']").onclick = async () => {
      postData('GET', '/messages', null, true)
        .then(async (response) => {
          const res = await response.json();
          if (parseInt(response.status, 10) === 401) {
            logOut();
          } else if ('error' in res) {
            throw new Error(res.error);
          } else if ('data' in res) {
            if ('id' in res.data[0]) {
              const divElement = document.createElement('div');
              const options = {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
              };
              res.data.forEach((message) => {
                const tempDiv = document.createElement('div');
                tempDiv.classList.add(message.status);
                tempDiv.innerHTML = `
                <input type="checkbox" value="${message.id}">
                <p>${message.senderEmail}</p>
                <div>
                  <p class="subject">${message.subject}</p>
                  <p class="msg">${message.message}</p>
                </div>
                <label>${new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(message.createdOn, 10)))}</label>`;
                divElement.appendChild(tempDiv);
              });
              document.querySelector('.right-inbox .inbox-view').innerHTML = divElement.innerHTML;
            } else {
              //  res.data[0].message;
            }
          }
        }).catch((error) => {
          alertMessage(error.message);
        });

      document.querySelectorAll('.right > div:not(.right-inbox)').forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Inbox'])").forEach((element) => {
        element.classList.remove('active');
      });
      document.querySelector("a[href='#Inbox']").classList.add('active');
      document.querySelector('.right-inbox').classList.remove('hidden');
    };

    document.querySelector("a[href='#Compose']").onclick = () => {
      showCompose();
      loadGroup();
    };
    document.querySelector("a[href='#Sent']").onclick = () => {
      document.querySelectorAll('.right  > div:not(.right-sent)').forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Sent'])").forEach((element) => {
        element.classList.remove('active');
      });
      document.querySelector("a[href='#Sent']").classList.add('active');
      document.querySelector('.right-sent').classList.remove('hidden');
    };
    document.querySelector("a[href='#Draft']").onclick = () => {
      document.querySelectorAll('.right  > div:not(.right-draft)').forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Draft'])").forEach((element) => {
        element.classList.remove('active');
      });
      document.querySelector("a[href='#Draft']").classList.add('active');
      document.querySelector('.right-draft').classList.remove('hidden');
    };
    document.querySelector("a[href='#Group']").onclick = () => {
      if (document.querySelector(".inbox > input[type='hidden']").value === 'Admin') {
        document.querySelectorAll('.right  > div:not(.right-group)').forEach((element) => {
          element.classList.add('hidden');
        });
        document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Group'])").forEach((element) => {
          element.classList.remove('active');
        });
        document.querySelector("a[href='#Group']").classList.add('active');
        document.querySelector('.right-group').classList.remove('hidden');
      } else {
        alertMessage('Only an Admin is allowed to create group');
      }
    };

    // veiw Message
    document.querySelectorAll('.right  > div:not(.right-draft) .inbox-view >div >*:not(input)').forEach((element) => {
      const elem = element;
      elem.onclick = () => {
        document.querySelector('.right-inbox ').classList.add('hidden');
        document.querySelector('.right-compose').classList.add('hidden');
        document.querySelector('.right-sent').classList.add('hidden');
        document.querySelector('.view-message').classList.remove('hidden');
      };
    });

    /** Log Out * */
    document.querySelector('.inbox .top div button').onclick = () => {
      alertMessage('See you soon buddy :-)');
      logOut();
    };

    /** Send mail * */
    document.querySelector("[name='sendMail']").onsubmit = () => {
      const sendButton = document.querySelector("[name='sendMail'] button");
      sendButton.innerHTML = 'SENDING';
      sendButton.classList.add('sending');

      setTimeout(() => {
        sendButton.innerHTML = 'SENT';
        sendButton.classList.add('sent');
        alertMessage('Message Sent Successffuly');
      }, 2000);
      setTimeout(() => {
        sendButton.innerHTML = 'SEND';
        sendButton.classList.remove('sending');
        sendButton.classList.remove('sent');
        document.querySelector("[name='sendMail']").reset();
      }, 3000);

      return false;
    };

    document.querySelectorAll(".inbox .right-compose .address span input[type='radio']").forEach((radioButton) => {
      const radioElement = radioButton;
      radioElement.onchange = () => {
        const selectedRadioValue = radioButton.value;
        const inputEmail = document.querySelector(".inbox .right-compose .address input[type='email']");
        const selectGroup = document.querySelector('.inbox .right-compose .address select');
        if (selectedRadioValue === 'Individual') {
          inputEmail.classList.remove('hidden');
          inputEmail.required = true;
          selectGroup.classList.add('hidden');
        } else if (selectedRadioValue === 'Group') {
          inputEmail.classList.add('hidden');
          inputEmail.required = false;
          selectGroup.classList.remove('hidden');
          loadGroup();
        }
      };
    });

    /** Retract a sent mail * */
    document.querySelector('#retract').onclick = () => {
      document.querySelectorAll('.inbox .bottom .right-sent .inbox-view >div >input').forEach((element) => {
        if (element.checked) {
          const mailID = `.right-sent .inbox-view  .s${element.value}`;
          alertMessage('Mail(s) Retracted Successfully');
          document.querySelector(mailID).classList.add('hidden');
        }
      });
    };

    /** Save mail as draft * */
    document.querySelector('#saveMail').onclick = () => {
      const topic = document.querySelector('.inbox .right-compose .message input').value;
      const msgBody = document.querySelector('.inbox .right-compose .message textarea').value;
      let mailTo = '';
      let mailToType = '';
      let mailID = '';
      if (topic.trim() === '') {
        alertMessage('Subject cannot be empty');
      } else if (msgBody.trim() === '') {
        alertMessage('Message body cannot be empty');
      } else {
        document.querySelectorAll(".inbox .right-compose .address span input[type='radio']").forEach((radioButton) => {
          if (radioButton.checked && radioButton.value === 'Individual') {
            mailTo = document.querySelector(".inbox .right-compose .address input[type='email']").value;
            mailToType = 'Individual';
          } else if (radioButton.checked && radioButton.value === 'Group') {
            const selectElement = document.querySelector('.inbox .right-compose .address select');
            const { selectedIndex } = selectElement; // geting index of selected option
            const { options } = selectElement; // getting collections of all options as an array
            mailTo = options[selectedIndex].value; // returning the value of selected option
            mailToType = 'Group';
          }
        });
        mailID = document.querySelector('.right-draft .inbox-view >div:last-child input') !== null ? parseInt(document.querySelector('.right-draft .inbox-view >div:last-child input').value, 10) + 1 : 0;

        const divElement = document.createElement('div');
        divElement.innerHTML = `<input type="hidden" value="${mailToType}">`
                                  + `<input type="checkbox" value="${mailID}">`
                                  + `<p>${mailTo}</p>`
                                  + '<div>'
                                      + `<p class="subject">${topic}</p>`
                                      + `<p class="msg">s${msgBody}</p>`
                                  + '</div>'
                                  + `<label>${new Date().getDate()}-${new Date().getMonth()}</label>`;
        divElement.setAttribute('class', `s${mailID}`);
        document.querySelector('.right-draft .inbox-view').appendChild(divElement);
        alertMessage('Message saved as draft succesfully');
        document.querySelector("[name='sendMail']").reset();
      }
    };

    /** Send Draft Message * */
    const sendDraftMessage = (mailDiv) => {
      const mailID = `.right-draft .inbox-view .s${mailDiv.querySelector("input[type='checkbox']").value}`;
      const mailToType = mailDiv.querySelector("input[type='hidden']").value;
      const mailTo = mailDiv.querySelector('p').innerHTML;
      const mailSubject = mailDiv.querySelector('div .subject').innerHTML;
      const mailBody = mailDiv.querySelector('div .msg').innerHTML;

      document.querySelector(`.right-compose .address input[type='radio'][value='${mailToType}']`).checked = true;
      if (mailToType === 'Individual') {
        document.querySelector(".right-compose .address input[type='email']").value = mailTo;
        document.querySelector(".right-compose .address input[type='email']").classList.remove('hidden');
        document.querySelector(".right-compose .address input[type='email']").required = true;
        document.querySelector('.right-compose .address select').classList.add('hidden');
      } else if (mailToType === 'Group') {
        const selectGroup = document.querySelector('.right-compose .address select');

        document.querySelector(".right-compose .address input[type='email']").classList.add('hidden');
        document.querySelector(".right-compose .address input[type='email']").required = false;
        selectGroup.classList.remove('hidden');

        loadGroup();
        selectGroup.value = mailTo;
      }
      document.querySelector(".right-compose .message input[type='text']").value = mailSubject;
      document.querySelector('.right-compose .message textarea').value = mailBody;
      deleteMail(mailID);
      showCompose();
      // alertMessage(mailBody);
    };
    // EVENT DELEGATION
    document.addEventListener('click', (e) => {
      if (e.target && Array.from(document.querySelectorAll('.right-draft .inbox-view >div >*:not(input)')).includes(e.target)) {
        const mailDiv = e.target.parentNode;
        sendDraftMessage(mailDiv);
      }
    });
    document.addEventListener('click', (e) => {
      if (e.target && Array.from(document.querySelectorAll('.right-draft .inbox-view >div div p')).includes(e.target)) {
        const mailDiv = e.target.parentNode.parentNode;
        sendDraftMessage(mailDiv);
      }
    });

    /** Delete draft * */
    document.querySelector('.right-draft .toolbar button.deleteButton').onclick = () => {
      document.querySelectorAll('.inbox .bottom .right-draft .inbox-view >div >input').forEach((element) => {
        if (element.checked) {
          const mailID = `.right-draft .inbox-view .s${element.value}`;
          deleteMail(mailID, 'Draft Mail(s) Deleted Successfully');
        }
      });
    };

    /** Delete inbox * */
    document.querySelector('.right-inbox .toolbar button.deleteButton').onclick = () => {
      document.querySelectorAll('.inbox .bottom .right-inbox .inbox-view >div >input').forEach((element) => {
        if (element.checked) {
          const mailID = `.right-inbox .inbox-view .s${element.value}`;
          deleteMail(mailID, 'Mail(s) Deleted Successfully');
        }
      });
    };

    /** Delete sent mail * */
    document.querySelector('.right-sent .toolbar button.deleteButton').onclick = () => {
      document.querySelectorAll('.inbox .bottom .right-sent .inbox-view >div >input').forEach((element) => {
        if (element.checked) {
          const mailID = `.right-sent .inbox-view  .s${element.value}`;
          alertMessage('Mail(s) Deleted Successfully');
          document.querySelector(mailID).classList.add('hidden');
        }
      });
    };

    /** Delete Group* */
    document.querySelector('.right-group .groups .btn button').onclick = () => {
      document.querySelectorAll('.right-group .groups input').forEach((element) => {
        if (element.checked) {
          alertMessage('Group(s) Deleted Successfully');
          element.parentNode.classList.add('hidden');
        }
      });
    };

    /** CREATE GROUP* */
    document.querySelector('.right-group #createGroup').onsubmit = () => {
      const groupName = document.querySelector(".right-group input[type='text']");
      if (groupName.value.trim() !== '') {
        const div = document.createElement('div');
        div.innerHTML = `<input type="checkbox"><a href="#">${groupName.value.trim()}</a>`;
        document.querySelector('.right-group .groups').appendChild(div);
        groupName.value = '';
        alertMessage('Group Created Successfully!');
      } else {
        alertMessage('Group name cannot be empty');
      }
      return false;
    };
  }
};

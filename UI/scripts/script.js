const postData = async (method = 'GET', path, data, auth) => {
  if (!path) {
    throw new Error('Path not defined!');
  }
  const url = `https://epic-mail-api.herokuapp.com/api/v1${path}`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (auth) {
    headers.append('authorization', localStorage.getItem('auth'));
  }
  const init = {
    method,
    headers,
  };

  if (data) {
    init.body = JSON.stringify(data);// body data type must match "Content-Type" header
  }

  const result = await fetch(url, init).then(response => response).catch((err) => {
    if (err.message === 'Failed to fetch') {
      throw Error('ERROR: Check your internet connection and try again');
    }
    throw err;
  });

  return result;
};

const toggleDisable = (...elements) => {
  elements.forEach((element) => {
    const ele = element;
    ele.disabled = !ele.disabled;
  });
};

const logOut = () => {
  localStorage.removeItem('auth');
  localStorage.removeItem('userEmail');
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
    if (element) {
      const name = element.innerHTML;
      const id = element.previousElementSibling.value;
      const option = document.createElement('option'); // create an option element(tag)
      const groupName = document.createTextNode(name); // create a textnode
      option.appendChild(groupName); // add text to option tag created
      option.setAttribute('value', id); // set value = name
      selectGroup.appendChild(option); // add option to Select element
    }
  });
};

const populateInbox = async (response) => {
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
      document.querySelector('.right-inbox .inbox-view').innerHTML = res.data[0].message;
    }
  }
};

const populateSent = async (response) => {
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
        <p>${message.receiverEmail}</p>
        <div>
          <p class="subject">${message.subject}</p>
          <p class="msg">${message.message}</p>
        </div>
        <label>${new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(message.createdOn, 10)))}</label>`;
        divElement.appendChild(tempDiv);
      });
      document.querySelector('.right-sent .inbox-view').innerHTML = divElement.innerHTML;
    } else {
      document.querySelector('.right-sent .inbox-view').innerHTML = res.data[0].message;
    }
  }
};

const populateDraft = async (response) => {
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
        <p>${message.receiverEmail || ''}</p>
        <div>
          <p class="subject">${message.subject}</p>
          <p class="msg">${message.message}</p>
        </div>
        <label>${new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(message.createdOn, 10)))}</label>`;
        divElement.appendChild(tempDiv);
      });
      document.querySelector('.right-draft .inbox-view').innerHTML = divElement.innerHTML;
    } else {
      document.querySelector('.right-draft .inbox-view').innerHTML = res.data[0].message;
    }
  }
};

const getGroups = async () => {
  postData('GET', '/groups', null, true).then(async (response) => {
    const res = await response.json();
    if (parseInt(response.status, 10) === 401) {
      logOut();
    } else if ('error' in res) {
      throw new Error(res.error);
    } else if ('data' in res) {
      if ('id' in res.data[0]) {
        const divElement = document.createElement('div');
        res.data.forEach((group) => {
          const div = document.createElement('div');
          if (group.userEmail === localStorage.getItem('userEmail')) {
            div.innerHTML += `<input type="checkbox" value="${group.id}"><a href="#">${group.name}</a>`;
          } else {
            div.innerHTML += `<input type="checkbox" value="${group.id}" disabled><a href="#">${group.name}</a>`;
          }
          divElement.append(div);
        });
        document.querySelector('.right-group .groups >div:nth-child(2)').innerHTML = divElement.innerHTML;
      } else {
        document.querySelector('.right-group .groups >div:nth-child(2)').innerHTML = res.data[0].message;
      }
    }
  }).catch((error) => { alertMessage(error.message); });
};

const getGroupMembers = async (groupId, checkbox) => {
  await postData('GET', `/groups/${groupId}`, null, true).then(async (response) => {
    const res = await response.json();
    if (parseInt(response.status, 10) === 401) {
      logOut();
    } else if ('error' in res) {
      throw new Error(res.error);
    } else if ('data' in res) {
      if ('userId' in res.data[0]) {
        res.data.forEach((member) => {
          const memberDiv = document.createElement('div');
          if (checkbox.disabled) {
            memberDiv.innerHTML = `<input type="checkbox" value="${member.userId}" disabled>`;
          } else {
            memberDiv.innerHTML = `<input type="checkbox" value="${member.userId}">`;
          }
          memberDiv.innerHTML += `<p>${member.userEmail}</p>
                                  <label>${member.userRole}</label>`;
          document.querySelector('.right-groupMember .member .inbox-view').append(memberDiv);
        });
      }
    }
  }).catch((error) => { alertMessage(error.message); });
};

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

const viewInboxMessage = async (maildId) => {
  postData('GET', `/messages/${maildId}`, null, true).then(async (response) => {
    const res = await response.json();
    if (parseInt(response.status, 10) === 401) {
      logOut();
    } else if ('error' in res) {
      throw new Error(res.error);
    } else if ('data' in res) {
      const viewMessageDiv = document.querySelector('.right .view-message');
      if ('id' in res.data[0]) {
        const divElement = document.createElement('div');
        const options = {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
        };

        res.data.forEach((message) => {
          const header = document.createElement('div');
          header.classList.add('top');
          if (message.senderEmail !== localStorage.getItem('userEmail')) {
            header.classList.add('away');
          }
          header.innerHTML = `
          <div>
            <div>
              <p>${message.senderFirstName}</p>
              <p>${message.senderEmail}</p>
            </div>
          </div>
          <label>${new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(message.createdOn, 10)))}</label>
        `;
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(header);
          tempDiv.innerHTML += `
            <h2>${message.subject}</h2>
            <div>
              ${message.message}
            </div>
          `;
          divElement.appendChild(tempDiv);
        });
        viewMessageDiv.innerHTML = divElement.innerHTML;
      } else {
        viewMessageDiv.innerHTML = res.data[0].message;
      }
      document.querySelector('.right-inbox ').classList.add('hidden');
      document.querySelector('.right-compose').classList.add('hidden');
      document.querySelector('.right-sent').classList.add('hidden');
      viewMessageDiv.classList.remove('hidden');
      document.querySelector('.right').scrollTop = viewMessageDiv.scrollHeight;
    }
  }).catch((error) => { alertMessage(error.message); });
};

const viewSentMessage = async (maildId) => {
  postData('GET', `/messages/sent/${maildId}`, null, true).then(async (response) => {
    const res = await response.json();
    if (parseInt(response.status, 10) === 401) {
      logOut();
    } else if ('error' in res) {
      throw new Error(res.error);
    } else if ('data' in res) {
      const viewMessageDiv = document.querySelector('.right .view-message');
      if ('id' in res.data[0]) {
        const divElement = document.createElement('div');
        const options = {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          year: 'numeric',
        };

        res.data.forEach((message) => {
          const header = document.createElement('div');
          header.classList.add('top');
          if (message.receiverEmail !== localStorage.getItem('userEmail')) {
            header.classList.add('away');
          }
          header.innerHTML = `
          <div>
            <div>
              <p>${message.receiverFirstName}</p>
              <p>${message.receiverEmail}</p>
            </div>
          </div>
          <label>${new Intl.DateTimeFormat('en-US', options).format(new Date(parseInt(message.createdOn, 10)))}</label>
        `;
          const tempDiv = document.createElement('div');
          tempDiv.appendChild(header);
          tempDiv.innerHTML += `
            <h2>${message.subject}</h2>
            <div>
              ${message.message}
            </div>
          `;
          divElement.appendChild(tempDiv);
        });
        viewMessageDiv.innerHTML = divElement.innerHTML;
      } else {
        viewMessageDiv.innerHTML = res.data[0].message;
      }
      document.querySelector('.right-inbox ').classList.add('hidden');
      document.querySelector('.right-compose').classList.add('hidden');
      document.querySelector('.right-sent').classList.add('hidden');
      viewMessageDiv.classList.remove('hidden');
      document.querySelector('.right').scrollTop = viewMessageDiv.scrollHeight;
    }
  }).catch((error) => { alertMessage(error.message); });
};

const sendMail = () => {
  const sendMsg = document.querySelector("[name='sendMail']");
  const { subject, message } = sendMsg;
  const inputEmail = document.querySelector(".inbox .right-compose .address input[type='email']");
  const selectGroup = document.querySelector('.inbox .right-compose .address select');
  const sendButton = document.querySelector("[name='sendMail'] button");
  const saveButton = document.querySelector('#saveMail');
  const saveMsgId = document.querySelector(".right-compose input[name='id']");
  let endpoint;

  const obj = {
    subject: subject.value.trim(),
    message: message.value.trim(),
  };
  let method = 'POST';
  if (saveMsgId.value) {
    obj.id = saveMsgId.value;
    method = 'PUT';
  }

  const radioBtn = Array.from(document.querySelectorAll(".inbox .right-compose .address span input[type='radio']"))
    .find(radioButton => radioButton.checked);

  if (radioBtn && radioBtn.value === 'Individual') {
    obj.receiverEmail = sendMsg.email.value;
    endpoint = '/messages';
  } else if (radioBtn && radioBtn.value === 'Group') {
    const selectElement = document.querySelector('.inbox .right-compose .address select');
    const { selectedIndex } = selectElement;
    const { options } = selectElement;
    const groupId = options[selectedIndex].value;
    if (!groupId || groupId.trim() === '') {
      alertMessage('Select a group to send message to');
    } else {
      endpoint = `/groups/${groupId}/messages`;
    }
  }

  if (endpoint) {
    sendButton.innerHTML = 'SENDING';
    sendButton.classList.add('sending');
    toggleDisable(subject, message, sendButton, saveButton, inputEmail, selectGroup);
    postData(method, endpoint, obj, true)
      .then(async (response) => {
        const res = await response.json();
        const status = parseInt(response.status, 10);
        if (status === 401) {
          logOut();
        } else if (status === 400 && res.error === 'Draft message does not exist!') {
          saveMsgId.value = null;
          await sendMail();
        } else if ('error' in res) {
          throw new Error(res.error);
        } else if ('data' in res && 'id' in res.data[0]) {
          setTimeout(() => {
            sendButton.innerHTML = 'SENT';
            sendButton.classList.add('sent');
            alertMessage('Message Sent Successfully');
            sendMsg.reset();
            postData('GET', '/messages', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
          }, 1000);
        }
      }).catch((error) => {
        alertMessage(error.message);
      }).finally(() => {
        setTimeout(() => {
          sendButton.innerHTML = 'SEND';
          sendButton.classList.remove('sending');
          sendButton.classList.remove('sent');
          saveMsgId.value = null;
          inputEmail.classList.remove('hidden');
          inputEmail.required = true;
          selectGroup.classList.add('hidden');
          selectGroup.required = false;
          document.querySelector('#saveMail').classList.remove('hidden');
          toggleDisable(subject, message, sendButton, saveButton, inputEmail, selectGroup);
        }, 2000);
      });
  }
};

const saveMail = () => {
  const composeForm = document.querySelector("[name='sendMail']");
  const { subject, message } = composeForm;
  const inputEmail = document.querySelector(".inbox .right-compose .address input[type='email']");
  const selectGroup = document.querySelector('.inbox .right-compose .address select');
  const sendButton = document.querySelector("[name='sendMail'] button");
  const saveButton = document.querySelector('#saveMail');
  const saveMsgId = document.querySelector(".right-compose input[name='id']");

  if (subject.value.trim() === '') {
    alertMessage('Subject cannot be empty');
  } else if (message.value.trim() === '') {
    alertMessage('Message body cannot be empty');
  } else {
    const obj = {
      subject: subject.value.trim(),
      message: message.value.trim(),
    };
    if (inputEmail.value && inputEmail.value.trim() !== '') {
      obj.receiverEmail = inputEmail.value.trim();
    }
    if (saveMsgId.value) {
      obj.id = saveMsgId.value;
    }
    toggleDisable(subject, message, sendButton, saveButton, inputEmail, selectGroup);
    postData('POST', '/messages/draft', obj, true)
      .then(async (response) => {
        const res = await response.json();
        const status = parseInt(response.status, 10);
        if (status === 401) {
          logOut();
        } else if (status === 400 && res.error === 'Draft message does not exist!') {
          saveMsgId.value = null;
          await saveMail();
        } else if ('error' in res) {
          throw new Error(res.error);
        } else if ('data' in res && 'id' in res.data[0]) {
          alertMessage('Message saved as draft succesfully');
          saveMsgId.value = null;
          inputEmail.classList.remove('hidden');
          inputEmail.required = true;
          selectGroup.classList.add('hidden');
          selectGroup.required = false;
          document.querySelector('#saveMail').classList.remove('hidden');
          composeForm.reset();
          postData('GET', '/messages/draft', null, true).then(populateDraft).catch((error) => { alertMessage(error.message); });
        }
      }).catch((error) => {
        alertMessage(error.message);
      }).finally(() => {
        toggleDisable(subject, message, sendButton, saveButton, inputEmail, selectGroup);
      });
  }
};

const sendDraftMessage = (mailDiv) => {
  const mailId = mailDiv.querySelector("input[type='checkbox']").value;
  const mailTo = mailDiv.querySelector('p').innerHTML;
  const mailSubject = mailDiv.querySelector('div .subject').innerHTML;
  const mailBody = mailDiv.querySelector('div .msg').innerHTML;

  document.querySelector(".right-compose input[name='id']").value = mailId;
  document.querySelector(".right-compose .address input[type='email']").value = mailTo;
  document.querySelector(".right-compose .message input[type='text']").value = mailSubject;
  document.querySelector('.right-compose .message textarea').value = mailBody;
  document.querySelector('.right-compose .address input[type=\'radio\'][value=\'Individual').checked = true;
  document.querySelector(".right-compose .address input[type='email']").required = true;
  document.querySelector(".right-compose .address input[type='email']").classList.remove('hidden');
  document.querySelector('.right-compose .address select').classList.add('hidden');

  showCompose();
  // alertMessage(mailBody);
};

const getSelectedCheckBox = (checkBoxes) => {
  const selected = Array.from(checkBoxes).filter((element) => {
    let bool = false;
    if (element.checked) {
      const ele = element;
      ele.checked = bool;
      bool = true;
      ele.disabled = bool;
    }
    return bool;
  });
  return selected;
};

window.onload = function ready() {
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
    /** Listen to url */
    if (window.location.search && window.location.search.trim() !== '') {
      const tokenUrl = window.location.search.trim();
      const tokenSplit = tokenUrl.split('?r=');
      const token = tokenSplit[1];
      if (token) {
        const obj = { token };
        postData('PUT', '/auth/reset', obj).then(async (response) => {
          const status = parseInt(response.status, 10);
          if (status === 401) {
            alertMessage('Invalid or Expired Password Rest Link');
          } else if (status === 200) {
            alertMessage('Password Reset Successfully');
          }
        }).catch((error) => { alertMessage(error.message); });
      }
    }

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

    document.querySelector('#resetForm').onsubmit = () => {
      const email = document.querySelector("#resetForm input[type='email']");
      const password = document.querySelector("#resetForm input[type='password']");
      const submitButton = document.querySelector('#resetForm button');
      if (email.value.trim() === '') {
        alertMessage('Please enter your Email address');
      } else if (password.value.trim() === '') {
        alertMessage('Please enter new password ');
      } else {
        const obj = {
          email: email.value.trim(),
          password: password.value.trim(),
        };

        toggleDisable(email, password, submitButton);
        postData('POST', '/auth/reset', obj).then(async (response) => {
          const res = await response.json();
          const status = parseInt(response.status, 10);
          if (status === 400) {
            alertMessage(res.error);
          } else if (status === 200) {
            alertMessage('Check your mail for Password Reset Confirmation link.');
          }
        }).catch((error) => { alertMessage(error.message); }).finally(() => {
          document.querySelector('#resetForm').reset();
          toggleDisable(email, password, submitButton);
        });
      }
      return false;
    };

    document.querySelector('#signInForm').onsubmit = () => {
      const email = document.querySelector("#signInForm input[type='email']");
      const password = document.querySelector("#signInForm input[type='password']");
      const loginBtn = document.querySelector('#signInForm button');
      const emailValue = email.value.trim();
      const passwordValue = password.value;
      toggleDisable(email, password, loginBtn);
      if (emailValue === '') {
        email.value = '';
        alertMessage('Enter email address');
      } else if (passwordValue === '') {
        password.value = '';
        alertMessage('Enter password');
      } else {
        const obj = {
          email: emailValue,
          password: passwordValue,
        };
        postData('POST', '/auth/login', obj)
          .then(async (response) => {
            const res = await response.json();

            if ('error' in res) {
              throw new Error(res.error);
            }
            if ('data' in res && 'token' in res.data[0]) {
              localStorage.setItem('auth', res.data[0].token);
              localStorage.setItem('userEmail', emailValue.toLowerCase());
              alertMessage('Login Successful');
              window.location.href = './inbox.html';
            }
          }).catch((error) => {
            alertMessage(error.message);
          }).finally(() => {
            toggleDisable(email, password, loginBtn);
            document.querySelector('#signInForm').reset();
          });
      }
      return false;
    };

    document.querySelector('#signUpForm').onsubmit = () => {
      const signUpForm = document.querySelector('#signUpForm');
      const password = signUpForm.signupPassword;
      const rePassword = signUpForm.signupRePassword;
      const firstName = signUpForm.signupFirstName;
      const email = signUpForm.signupEmail;
      if (firstName.value.trim() === '') {
        alertMessage('Enter first name');
      } else if (password.value !== rePassword.value) {
        alertMessage('Password do no match');
      } else {
        toggleDisable(email, firstName, password, rePassword);
        const obj = {
          firstName: firstName.value.trim(),
          email: email.value.trim(),
          password: password.value,
          rePassword: rePassword.value,
        };
        postData('POST', '/auth/signup', obj)
          .then(async (response) => {
            const res = await response.json();
            if ('error' in res) {
              throw new Error(res.error);
            }
            if ('data' in res && 'token' in res.data[0]) {
              alertMessage('Account created Succesful!');
              window.location.reload();
            }
          }).catch((error) => {
            alertMessage(error.message);
          }).finally(() => {
            toggleDisable(email, firstName, password, rePassword);
            signUpForm.reset();
          });
      }
      return false;
    };
  }

  if (document.querySelector("a[href='#Inbox']")) { // if on dashboard page -> inbox.html
    // Check if user is logged in
    if (!localStorage.getItem('auth')) {
      window.location.replace('./loginPage.html');
    } else {
      document.querySelector('.inbox .top p').innerHTML = localStorage.getItem('userEmail').toLowerCase();
      getGroups();
      postData('GET', '/messages', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
      postData('GET', '/messages/sent', null, true).then(populateSent).catch((error) => { alertMessage(error.message); });
      postData('GET', '/messages/draft', null, true).then(populateDraft).catch((error) => { alertMessage(error.message); });
    }

    //  Menu buttons
    (() => {
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
    })();

    // EVENT DELEGATION
    document.addEventListener('click', (e) => {
      //  Draft
      if (e.target && Array.from(document.querySelectorAll('.right-draft .inbox-view >div >*:not(input)')).includes(e.target)) {
        const mailDiv = e.target.parentNode;
        sendDraftMessage(mailDiv);
      }
      if (e.target && Array.from(document.querySelectorAll('.right-draft .inbox-view >div div p')).includes(e.target)) {
        const mailDiv = e.target.parentNode.parentNode;
        sendDraftMessage(mailDiv);
      }
      // Inbox
      if (e.target && Array.from(document.querySelectorAll('.right  > div.right-inbox .inbox-view >div >*:not(input)')).includes(e.target)) {
        let mailDiv = e.target.previousElementSibling;
        if (!mailDiv.value) {
          mailDiv = mailDiv.previousElementSibling.previousElementSibling;
        }
        viewInboxMessage(mailDiv.value);
      }
      if (e.target && Array.from(document.querySelectorAll('.right  > div.right-inbox .inbox-view >div >div p')).includes(e.target)) {
        const mailDiv = e.target.parentNode.previousElementSibling.previousElementSibling;
        viewInboxMessage(mailDiv.value);
      }
      //  Sent
      if (e.target && Array.from(document.querySelectorAll('.right  > div.right-sent .inbox-view >div >*:not(input)')).includes(e.target)) {
        let mailDiv = e.target.previousElementSibling;
        if (!mailDiv.value) {
          mailDiv = mailDiv.previousElementSibling.previousElementSibling;
        }
        viewSentMessage(mailDiv.value);
      }
      if (e.target && Array.from(document.querySelectorAll('.right  > div.right-sent .inbox-view >div >div p')).includes(e.target)) {
        const mailDiv = e.target.parentNode.previousElementSibling.previousElementSibling;
        viewSentMessage(mailDiv.value);
      }
      //  Group
      if (e.target && Array.from(document.querySelectorAll('.right-group .groups div a')).includes(e.target)) {
        const checkBox = e.target.previousElementSibling;
        (() => {
          const groupName = e.target.innerHTML;
          document.querySelector('.right-groupMember .member .inbox-view').innerHTML = '';
          document.querySelector('.right-groupMember > input[type = "hidden"]').value = checkBox.value;
          document.querySelector('.right-groupMember .update div:first-child label').innerHTML = groupName;
          document.querySelector('.right-groupMember .update div:first-child label').classList.remove('hidden');
          document.querySelector('.right-groupMember .update div:first-child input').classList.add('hidden');
          const editBtn = document.querySelector('.right-groupMember .update div:last-child button:nth-child(1)');
          editBtn.classList.remove('hidden');
          editBtn.nextElementSibling.classList.add('hidden');
          editBtn.nextElementSibling.nextElementSibling.classList.add('hidden');
          document.querySelector('.right-group').classList.add('hidden');
          document.querySelector('.right-groupMember').classList.remove('hidden');
          const showHide = (bool) => {
            editBtn.disabled = bool;
            document.querySelector('.right-groupMember .addMember button').disabled = bool;
            document.querySelector('.right-groupMember .addMember input').disabled = bool;
            document.querySelector('.right-groupMember .toolbar button').disabled = bool;
          };
          showHide(checkBox.disabled);
        })();

        const groupId = document.querySelector('.right-groupMember > input[type = "hidden"]').value;
        getGroupMembers(groupId, checkBox);
      }
    });

    /** Left-panel-Menus Event * */
    document.querySelectorAll(".inbox  .toolbar span input[type='radio']").forEach((radioButton) => {
      const radioElement = radioButton;
      radioElement.onchange = () => {
        const selectedRadioValue = radioButton.value;

        if (selectedRadioValue === 'All') {
          postData('GET', '/messages', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        } else if (selectedRadioValue === 'Unread') {
          postData('GET', '/messages/unread', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        } else if (selectedRadioValue === 'Read') {
          postData('GET', '/messages/read', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        }
      };
    });
    document.querySelector("a[href='#Inbox']").onclick = () => {
      document.querySelectorAll(".inbox  .toolbar span input[type='radio']").forEach((radioButton) => {
        if (radioButton.checked && radioButton.value === 'All') {
          postData('GET', '/messages', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        } else if (radioButton.checked && radioButton.value === 'Unread') {
          postData('GET', '/messages/unread', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        } else if (radioButton.checked && radioButton.value === 'Read') {
          postData('GET', '/messages/read', null, true).then(populateInbox).catch((error) => { alertMessage(error.message); });
        }
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
      postData('GET', '/messages/sent', null, true).then(populateSent).catch((error) => { alertMessage(error.message); });

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
      postData('GET', '/messages/draft', null, true).then(populateDraft).catch((error) => { alertMessage(error.message); });
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
      getGroups();
      document.querySelectorAll('.right  > div:not(.right-group)').forEach((element) => {
        element.classList.add('hidden');
      });
      document.querySelectorAll(".inbox .bottom .left> ul >li a:not([href='#Group'])").forEach((element) => {
        element.classList.remove('active');
      });
      document.querySelector("a[href='#Group']").classList.add('active');
      document.querySelector('.right-group').classList.remove('hidden');
    };

    /** Log Out * */
    document.querySelector('.inbox .top div button').onclick = () => {
      alertMessage('See you soon buddy :-)');
      logOut();
    };

    /** Send mail * */
    document.querySelector("[name='sendMail']").onsubmit = () => {
      sendMail();
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
          document.querySelector('#saveMail').classList.remove('hidden');
        } else if (selectedRadioValue === 'Group') {
          inputEmail.classList.add('hidden');
          inputEmail.required = false;
          selectGroup.classList.remove('hidden');
          document.querySelector('#saveMail').classList.add('hidden');
          loadGroup();
        }
      };
    });

    /** Save mail as draft * */
    document.querySelector('#saveMail').onclick = () => {
      saveMail();
    };

    /** Delete draft * */
    document.querySelector('.right-draft .toolbar button.deleteButton').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-draft .inbox-view >div >input');
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        const mailId = element.value;

        await postData('DELETE', `/messages/draft/${mailId}`, null, true)
          .then(async (response) => {
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if (parseInt(response.status, 10) === 204) {
              document.querySelector('.right-draft .inbox-view').removeChild((element.parentNode));
              //  alertMessage('Mail(s) Deleted Successfully');
            } else if (parseInt(response.status, 10) === 404) {
              const res = await response.json();
              document.querySelector('.right-draft .inbox-view').removeChild((element.parentNode));
              throw new Error(res.error);
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      });
    };

    /** Delete inbox * */
    document.querySelector('.right-inbox .toolbar button.deleteButton').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-inbox .inbox-view >div >input');
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        const mailId = element.value;

        await postData('DELETE', `/messages/${mailId}`, null, true)
          .then(async (response) => {
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if (parseInt(response.status, 10) === 204) {
              document.querySelector('.right-inbox .inbox-view').removeChild((element.parentNode));
            } else if (parseInt(response.status, 10) === 404) {
              const res = await response.json();
              document.querySelector('.right-inbox .inbox-view').removeChild((element.parentNode));
              throw new Error(res.error);
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      });
    };

    /** Delete sent mail * */
    document.querySelector('.right-sent .toolbar button.deleteButton').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-sent .inbox-view >div >input');
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        const mailId = element.value;
        await postData('DELETE', `/messages/sent/${mailId}`, null, true)
          .then(async (response) => {
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if (parseInt(response.status, 10) === 204) {
              document.querySelector('.right-sent .inbox-view').removeChild((element.parentNode));
            } else if (parseInt(response.status, 10) === 404) {
              const res = await response.json();
              document.querySelector('.right-sent .inbox-view').removeChild((element.parentNode));
              throw new Error(res.error);
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      });
    };

    /** Retract a sent mail * */
    document.querySelector('#retract').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-sent .inbox-view >div >input');
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        const mailId = element.value;
        await postData('DELETE', `/messages/sent/${mailId}/retract`, null, true)
          .then(async (response) => {
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if (parseInt(response.status, 10) === 204) {
              document.querySelector('.right-sent .inbox-view').removeChild((element.parentNode));
              //  alertMessage('Mail(s) Deleted Successfully');
            } else if (parseInt(response.status, 10) === 404) {
              const res = await response.json();
              document.querySelector('.right-sent .inbox-view').removeChild((element.parentNode));
              throw new Error(res.error);
            }
          }).catch((error) => {
            alertMessage(error.message);
          });
      });
    };

    /** Delete Group* */
    document.querySelector('.right-group .groups .btn button').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-group .groups input');
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        if (element.checked) {
          const mailId = element.value;
          await postData('DELETE', `/groups/${mailId}`, null, true)
            .then(async (response) => {
              const resStatus = parseInt(response.status, 10);
              if (resStatus === 401) {
                logOut();
              } else if (resStatus === 204) {
                document.querySelector('.right-group .groups >div:nth-child(2)').removeChild((element.parentNode));
              } else if (resStatus === 404 || resStatus === 400) {
                const res = await response.json();
                document.querySelector('.right-group .groups >div:nth-child(2)').removeChild((element.parentNode));
                throw new Error(res.error);
              }
            }).catch((error) => {
              alertMessage(error.message);
            });
        }
      });
    };

    /** Create Group* */
    document.querySelector('.right-group #createGroup').onsubmit = () => {
      const groupElement = document.querySelector(".right-group input[type='text']");
      const submitBtn = document.querySelector('.right-group .create button');
      const groupName = groupElement.value.trim();
      if (groupName !== '') {
        const obj = {
          name: groupName,
        };
        toggleDisable(groupElement, submitBtn);
        postData('POST', '/groups', obj, true)
          .then(async (response) => {
            const res = await response.json();
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if ('error' in res) {
              throw new Error(res.error);
            } else if ('data' in res && 'id' in res.data[0]) {
              getGroups();
              groupElement.value = '';
            }
          }).catch((error) => {
            alertMessage(error.message);
          }).finally(() => {
            toggleDisable(groupElement, submitBtn);
          });
      } else {
        alertMessage('Group name cannot be empty');
      }
      return false;
    };

    const editBtn = document.querySelector('.right-groupMember .update div:last-child button:nth-child(1)');
    const updateBtn = editBtn.nextElementSibling;
    const cancelBtn = editBtn.nextElementSibling.nextElementSibling;
    const groupLable = document.querySelector('.right-groupMember .update div:first-child label');
    const groupEditInput = document.querySelector('.right-groupMember .update div:first-child input');

    /** Edit  Group Name* */
    editBtn.onclick = () => {
      const groupName = groupLable.innerHTML;
      groupEditInput.value = groupName;
      groupLable.classList.add('hidden');
      editBtn.classList.add('hidden');
      updateBtn.classList.remove('hidden');
      cancelBtn.classList.remove('hidden');
      groupEditInput.classList.remove('hidden');
    };

    /** Update Group Name* */
    document.querySelector('.right-groupMember #editGroupName').onsubmit = () => {
      const groupId = document.querySelector('.right-groupMember > input[type = "hidden"]').value;
      const obj = {
        name: groupEditInput.value,
      };
      const submitBtn = document.querySelector('.right-groupMember #editGroupName');
      toggleDisable(submitBtn, groupEditInput);
      postData('PATCH', `/groups/${groupId}/name`, obj, true)
        .then(async (response) => {
          const res = await response.json();
          if (parseInt(response.status, 10) === 401) {
            logOut();
          } else if ('error' in res) {
            throw new Error(res.error);
          } else if ('data' in res) {
            if ('id' in res.data[0]) {
              groupLable.innerHTML = res.data[0].name;
              groupLable.classList.remove('hidden');
              editBtn.classList.remove('hidden');
              updateBtn.classList.add('hidden');
              cancelBtn.classList.add('hidden');
              groupEditInput.classList.add('hidden');
            } else {
            //  res.data[0].message;
            }
          }
        }).catch((error) => {
          alertMessage(error.message);
        }).finally(() => {
          toggleDisable(submitBtn, groupEditInput);
        });
      return false;
    };

    /** Cancel Group Name Update* */
    cancelBtn.onclick = () => {
      const groupName = groupLable.innerHTML;
      groupEditInput.value = groupName;
      groupLable.classList.remove('hidden');
      editBtn.classList.remove('hidden');
      updateBtn.classList.add('hidden');
      cancelBtn.classList.add('hidden');
      groupEditInput.classList.add('hidden');
    };

    /** Add Group Member* */
    document.querySelector('.right-groupMember .addMember >form').onsubmit = () => {
      const form = document.querySelector('.right-groupMember .addMember form');
      const submitBtn = form.querySelector('button');
      const { email } = form;
      const emailVal = email.value;
      if (email.value.trim() === '') {
        alertMessage('Enter group member\'s email');
      } else {
        const groupId = document.querySelector('.right-groupMember > input[type = "hidden"]').value;
        const obj = {
          userEmail: emailVal,
        };
        toggleDisable(email, submitBtn);
        postData('POST', `/groups/${groupId}/users`, obj, true)
          .then(async (response) => {
            const res = await response.json();
            if (parseInt(response.status, 10) === 401) {
              logOut();
            } else if ('error' in res) {
              throw new Error(res.error);
            } else if ('data' in res) {
              if ('id' in res.data[0]) {
                const memberDiv = document.createElement('div');
                memberDiv.innerHTML = `<input type="checkbox" value="207">
                                      <p>${res.data[0].userEmail}</p>
                                      <label>Member</label>`;
                document.querySelector('.right-groupMember .member .inbox-view').append(memberDiv);
              } else {
                //  res.data[0].message;
              }
            }
          }).catch((error) => {
            alertMessage(error.message);
          }).finally(() => {
            form.reset();
            toggleDisable(email, submitBtn);
          });
      }
      return false;
    };

    /** Delete Group Member* */
    document.querySelector('.right-groupMember .toolbar button').onclick = () => {
      const checkBoxes = document.querySelectorAll('.right-groupMember .member .inbox-view div >input');
      const groupId = document.querySelector('.right-groupMember > input[type = "hidden"]').value;
      const selected = getSelectedCheckBox(checkBoxes);
      selected.forEach(async (element) => {
        if (element.checked) {
          const userId = element.value;
          await postData('DELETE', `/groups/${groupId}/users/${userId}`, null, true)
            .then(async (response) => {
              const resStatus = parseInt(response.status, 10);
              if (resStatus === 401) {
                logOut();
              } else if (resStatus === 204) {
                document.querySelector('.right-groupMember .member .inbox-view').removeChild((element.parentNode));
              } else if (resStatus === 404 || resStatus === 400) {
                const res = await response.json();
                throw new Error(res.error);
              }
            }).catch((error) => {
              alertMessage(error.message);
            });
        }
      });
    };
  }
};

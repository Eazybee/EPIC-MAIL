[![Build Status](https://travis-ci.org/Eazybee/EPIC-MAIL.svg?branch=develop)](https://travis-ci.org/Eazybee/EPIC-MAIL)
[![Coverage Status](https://coveralls.io/repos/github/Eazybee/EPIC-MAIL/badge.svg)](https://coveralls.io/github/Eazybee/EPIC-MAIL)

# EPIC MAIL
Epic Mail is a mailing web app that enables user to exchange information over the internet.

# Getting Started

## Prerequisite
1. Internet connection
2. Internet browser
3. git
4. nodejs

## Template URL
- https://eazybee.github.io/EPIC-MAIL/UI/index.html


## API URL
- https://epic-mail-api.herokuapp.com/api-docs

## User Access
Admin user
- email: admin@epicmail.com
- password: Password123 

## How to get a local copy
#### Clone repository
* Copy repository link
* Create a folder location in your computer eg my/myfolder
* cd my/myfolder/
* git clone repositorylink.git
* cd EPIC-MAIL
* run ```npm install```
* run ```npm run dev-start```
* open index.html file
* Sign-in with any dummy email and passowrd

## Routes

* POST https://epic-mail-api.herokuapp.com/api/v1/auth/signup - Create new user
* POST https://epic-mail-api.herokuapp.com/api/v1/auth/login - Log in a user
* POST https://epic-mail-api.herokuapp.com/api/v1/messages - Send message
* POST https://epic-mail-api.herokuapp.com/api/v1/messages/save - Save message as draft
* GET https://epic-mail-api.herokuapp.com/api/v1/messages - Get user's inbox
* GET https://epic-mail-api.herokuapp.com/api/v1/messages/read - Get user's read inbox
* GET https://epic-mail-api.herokuapp.com/api/v1/messages/unread -  Get user's unread inbox
* GET https://epic-mail-api.herokuapp.com/api/v1/messages/sent - Get user's sent messages
* GET https://epic-mail-api.herokuapp.com/api/v1/messages/{id} - Get message with the specified id
* PUT https://epic-mail-api.herokuapp.com/api/v1/messages - Send a draft message
* DELETE https://epic-mail-api.herokuapp.com/api/v1/messages/{id} - Delete message with specified id

## Branches
* The branches are structured according to git work flow. 
* Naming convention is according to andela branch naming convention. 
The develop branch is positioned currently as the default branch due to the on-going nature of this project. It is expected that as the project nears completion some branches will be merged and completely deleted

## Testing

Test locally by running index.html on web browser
Unt Test locally by runnung ```npm run test```

# Built with
1. Html
2. Css
3. JavaScript
4. nodejs

# Deployed on
1. github page
2. heroku

# Code Contributors
* Ilori Ezekiel (Eazybee)

# Credits
  - Onengiye Richard (klevamane) for Readme Template https://github.com/klevamane/Maintenance-tr/blob/develop/README.md
  - Traversy videos on node js https://www.youtube.com/watch?v=k_0ZzvHbNBQ&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp 

# Author
* Ilori Ezekiel (Eazybee)

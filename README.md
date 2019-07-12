[![Build Status](https://travis-ci.org/Eazybee/EPIC-MAIL.svg?branch=develop)](https://travis-ci.org/Eazybee/EPIC-MAIL)
[![Coverage Status](https://coveralls.io/repos/github/Eazybee/EPIC-MAIL/badge.svg)](https://coveralls.io/github/Eazybee/EPIC-MAIL) [![Greenkeeper badge](https://badges.greenkeeper.io/Eazybee/EPIC-MAIL.svg)](https://greenkeeper.io/)

# EPIC MAIL
Epic Mail is a mailing web app that enables user to exchange information over the internet.

# Getting Started

## Prerequisite
1. Internet connection
2. Internet browser
3. Git
4. Nodejs
5. Postgres

## Template URL
- https://eazybee.github.io/EPIC-MAIL/UI/index.html


## API URL
- https://epic-mail-api.herokuapp.com/api-docs

## User Access
- email: admin@andela.com
- password: andela 

## How to get a local copy
#### Clone repository
* Copy repository link
* Create a folder location in your computer eg my/myfolder
* cd my/myfolder/
* git clone repositorylink.git
* cd EPIC-MAIL
* run ```npm install```
* run ```npm run start```
* open index.html file
* Sign up and Log in

## Routes
#####Host: https://epic-mail-api.herokuapp.com/api/v1

<table>
  <tr>
    <th>VERB</th>
    <th>ENDPOINTS</th>
    <th>DESCRIPTION</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/signup</td>
    <td>Create new user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/auth/login</td>
    <td>Log in a user</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>​/auth​/reset</td>
    <td>Request password reset</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>​/auth​/reset</td>
    <td>Password request confirmation</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/messages</td>
    <td>Send message</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/messages/draft</td>
    <td>Save message as draft</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/draft</td>
    <td>Get user's draft messages</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>/messages</td>
    <td>Send a draft message</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/messages/draft/:id</td>
    <td>Delete draft message with specified id</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages</td>
    <td>Get user's inbox</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/read</td>
    <td>Get user's read inbox</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/unread</td>
    <td>Get user's unread inbox</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/sent</td>
    <td>Get user's sent messages</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/sent/:id</td>
    <td>Get user's sent message with the specified id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/messages/sent/:id</td>
    <td>Delete user's sent message with the specified id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/messages/sent/:id/retract</td>
    <td>Retract user's sent message with the specified id</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/messages/:id</td>
    <td>Get user's inbox message with the specified id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/messages/:id</td>
    <td>Delete inbox message with specified id</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/groups</td>
    <td>Create new group</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/groups​/:id/users</td>
    <td>Add a user to a group</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/groups​/:id/messages</td>
    <td>Send mail to a group</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>​/groups​/:id​/messages</td>
    <td>Send draft mail to a group</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/groups​</td>
    <td>Get user's groups</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/groups​/:id</td>
    <td>Get members of a specified group</td>
  </tr>
  <tr>
    <td>PATCH</td>
    <td>/groups/:id/name​</td>
    <td>Update a group name</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/groups/:id</td>
    <td>Delete the group with the specified id</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/groups/:groupId/users/:userId</td>
    <td>Delete a member from a group</td>
  </tr>
</table>

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
5. postgres

# Deployed on
1. github page
2. heroku

# Code Contributors
* Ilori Ezekiel (Eazybee)

# Credits
  - Onengiye Richard (klevamane) for Readme Template https://github.com/klevamane/Maintenance-tr/blob/develop/README.md
  - Traversy videos on node js https://www.youtube.com/watch?v=k_0ZzvHbNBQ&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp 
- Andela 42 cycle bootcampers, VLFs and LFAs for helping to unblock me.

# Author
* Ilori Ezekiel (Eazybee)

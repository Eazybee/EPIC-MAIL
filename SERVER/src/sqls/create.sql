CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(128) NULL,
  last_name VARCHAR(128) NULL,
  email VARCHAR(128) NULL,
  password VARCHAR(128) NULL,
  question VARCHAR(128) NULL,
  answer VARCHAR(128) NULL,
  status VARCHAR(128) NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(128) NULL,
  message TEXT NULL,
  owner_id INTEGER NULL,
  status VARCHAR(128) NULL,
  date_time BIGINT NULL
);

CREATE TABLE IF NOT EXISTS inboxes (
  id SERIAL PRIMARY KEY,
  msg_id INTEGER NULL,
  receiver_id INTEGER NULL,
  status VARCHAR(128) NULL,
  date_time BIGINT NULL
);

CREATE TABLE IF NOT EXISTS sents (
  id SERIAL PRIMARY KEY,
  msg_id INTEGER NULL,
  sender_id INTEGER NULL,
  status VARCHAR(128) NULL,
  date_time BIGINT NULL
);

CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NULL,
  name  VARCHAR(128) NULL
);

CREATE TABLE IF NOT EXISTS group_member (
  group_id INTEGER NULL,
owner_id INTEGER NULL
);

INSERT INTO users(first_name, last_name, email, password, status) VALUES('shittu', 'ayomipo', 'ayomipo@test.com', 'ayo123', 'user');
INSERT INTO users(first_name, last_name, email, password, status) VALUES('John', 'doe', 'johndoe@test.com', 'john123', 'user');
INSERT INTO users(first_name, last_name, email, password, status) VALUES('mary', 'jane', 'maryj@test.com', 'spiderman123', 'admin');

INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 3, 1552997209747, 'sent');
INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 3, 1552997209748, 'sent');
INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 2, 1552997209749, 'sent');
INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 1, 1552997209750, 'sent');
INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 3, 1552997209751, 'sent');
INSERT INTO messages(subject, message, owner_id, date_time, status) VALUES('Hi buddy', 'Just wanna say Hi', 2, 1552997209752, 'sent');

INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(1, 2, 'unread', 1552997209747);
INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(2, 2, 'unread', 1552997209748);
INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(3, 3, 'unread', 1552997209749);
INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(4, 3, 'read', 1552997209750);
INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(5, 1, 'unread', 1552997209751);
INSERT INTO inboxes(msg_id, receiver_id, status, date_time) VALUES(6, 3, 'unread', 1552997209752);

INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(1, 3, 'sent', 1552997209747);
INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(2, 3, 'sent', 1552997209748);
INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(3, 2, 'sent', 1552997209749);
INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(4, 1, 'sent', 1552997209750);
INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(5, 3, 'sent', 1552997209751);
INSERT INTO sents(msg_id, sender_id, status, date_time) VALUES(6, 2, 'sent', 1552997209752);

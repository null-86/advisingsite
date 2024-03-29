# Advising Project
Summary: This is a web application build with React, Expressjs, MySQL, and loaded onto an AWS instance running Apache server. This was developed as a group project in college. This application was designed to guide students and their advisors through class registration throughout their time in college. 

Specifications: 

1. Allow advisors to make available appointment time-slots.
2. Allow students to register for time-slots.
3. Track appointments for the Advisor and hide unavailable appointments for the students.
4. Allow either students or advisors to create a list of classes per semester.
5. Require the other party to verify the list of classes (dual control).
6. Track course list per semester.

Different Menu options were presented depending on whether the user was an advisor, student, or both (Edge-case).

Data import was deemed outside the scope of the project by Professor, so we did not build an admin interface into the web app.

** Data was encrypted at rest, but we did not implement https like we should have.**

Issues: Folder organization was subpar. Lack of Https implementation. Duplicate components were created by separate members of the team due to lack of communication. CSS is all over the place. We were all 
eager to learn, so we took vertical slices of the project where we developed different front-end UI, the back-end api calls that it needed, and the Database queries that the API relied on (prepared statements in an attempt to avoid Query Injection).

Lessons learned: Folder structure is important, especially in larger projects. We also should've divided responsibilities more cleanly. The division we took allowed us to learn more, but it also made us all work much harder than necessary. A real project would benefit from role specialization. 







--------------------------------------------------------------------------------------


> CSCI 4060 Capstone Project


## To Run
- 'ctrl + ~' will open the terminal
- type `npm start` in the terminal
- open http://localhost:3000 on your computer
- type "ctrl + c" in the terminal to terminate localhost

## Setup
- Open Git Bash on your desktop (right click)
- Run a few commands in your Git Bash before continuing: 
    -   `npm install npm -g` downloads the latest version of npm
    -   `node -v` will check to see if you already have NodeJS downloaded. If you do, run this command: `npm install update-node`. Run `node -v` again and ensure you have version 14.*.*. Any sub-versions are allowed; just make sure you have v14. *We all need to have the same version.*
> Run the following commands in Git Bash in the order they are listed:
```shell
$ mkdir advisingsite
$ cd advisingsite
$ npm install -g create-react-app
$ npx create-react-app client 
```
- I called mine advisingsite. If you already downloaded/created a ReactApp, create a new App titled *advisingsite*. We need to have the same primary directory name.
```shell
$ cd client
$ npm init --yes
```
- This creates a package.json file which we will need
```shell
$ npm install react-bootstrap react-router --save
$ npm install react-typescript --save
$ npm install dotenv --save
```
- This creates a .env file. We don't need it yet, so leave it blank.
```shell
$ cd ..  (back into advisingsite dir)
$ mkdir server
$ cd server
$ npm init --yes
$ npm install express body-parser  --save
$ npm install express-session
$ npm install -D nodemon
```
- This installs Bcrypt modules(make sure you install it in /server & /db directory)
```shell
$ npm i bcrypt
```

- CSV parser
```shell
$ npm i jquery-csv
```

> Some side notes

- You'll have to download my files or you can copy/paste into files you made of the same name. Up to you. ReactJS gives you some files automatically when you use `create-react-app`, so make sure to delete the files I don't have in my repo. They won't hurt anything; they just waste space. *Basically, try to sure everything matches what's both inside and outside my files.*
- Port 3000 is the client port.
- Port 8080 *will be* the database/server port.
- You must `cd client` before you `npm start` for now. This is because we don't have own server set up, so we are only using React's server as the client server. Once we get our server set up in our server directory, the client will continue to run its own server from the client dir, and we'll run our own server from the server dir. They'll be run simutaneously. 

## My Database Stuff
- Use the testDB database
- I used these commands to create the 'sampleAccts' table: 
```shell
$ create table sampleAccts(`id` int(11) NOT NULL,   
`username` varchar(50) NOT NULL,   
`password` varchar(255) NOT NULL,   
`email` varchar(100) NOT NULL) default charset=utf8;
$ ALTER TABLE `sampleAccts` ADD PRIMARY KEY (`id`);
$ ALTER TABLE `sampleAccts` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
```
- To insert into the sampleAccts table, use this format:
```shell
INSERT INTO `sampleAccts` (`id`, `username`, `password`, `email`) VALUES (1, 'test', 'test', 'test@test.com');
```
- Currently we only have (1, 'test', 'test', 'test@test.com'), (2, 'test2', 'testPw', 'testEmail@whocares.com') in our database. This will be our tester values for logging in. If you add more, please add them to the GitHub (for now).

## File Layout
```
advisingproject
└─── client
│   └─── node_modules
│       │   buncha files here
│       │   ...
│   └─── public
│       │   imported ReactJS files here
│       │   ...
│   └─── src
│       │   App.css
│       │   App.test.js
│       │   App.tsx
│       │   index.css
│       │   index.js
│       │   logo.svg
│       │   react-app-env.d.ts
│       │   serviceWorker.js
│       │   setupTests.js
│       └─── API
│       │       |    constants.js
│       │       |    index.ts
│       │       |    loginAPI.js
│       └─── pages
│       │       |    Home.js
│       │       |    index.ts
│       │       |    Login.tsx
│       └─── components
│   │   .gitignore
│   │   package.json
│   │   package-lock.json
│   │   tsconfig.json
└─── server
│   └─── db
│       │   config.js
|       |   UsersDB.js
|   │   package.json
|   |   index.json
│   README.md
```

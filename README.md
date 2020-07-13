# Yin Yang Gone Public

This bot started out as the AIG (An Idiots Guide) boilerplate bot (GuideBot). Over time it has grown into quite the project. You can still find a lot of the original boilerplate in its source code. As it grew features from two more iconic bots (at least imo) had snuck there way in, those two bots were: The DBM Network Manager developed by: the Networks dev team, and Simplicity developed by: Almeida & Tsugami. When I started this project I wasn't sure what exactly I was planning to do. however as I worked on it these past two years it became clear I was more interested in the 'back end' rather than making commands. I plan on keeping up with development of this bot, however without any real expectations for release dates/times. so without further ado lets get into setting up the bot for your own personalized experience.

## Module Setup

This bot uses enmap which uses sqlite3 and better-sqlite-pool both use node-gyp to build the core module if you know anything about node-gyp you will know its a pain in the rear. For best results i recommend spending some time learning about node-gyp in general. but for the quick and dirty lets use some commands.

`Note: Make sure you have both nodejs and either yarn or npm installed?`

Windows:

```
  Note: This must be done with elevated perms (Admin)
  npm i -g --add-python-to-path --vs2015 --production windows-build-tools
  close all command prompt/powershell windows
```

Linux:
```
  Note: You may need to install python-2 separately
  sudo apt-get install build-essential
```

Once you have the require packages install (above)

Install Modules:
```
  NPM: npm install
  YARN: yarn install
```

Setup .env:
```
  Windows: copy .env.example .env
  Linux: cp .env.example .env
```

Open the `.env` in your text editor of choice and fill in the required information. (I plan on making an installer one day for this)

Setup config.js:
```
  Windows: copy data/config.js.example data/config.js
  Linux: cp data/config.js.example data/config.js
```

Only thing left to do is go to the data folder and edit the `config.js` file adding your `userID` into the bot admins array.

You can now start the bot, `node .`

~ Happy Coding ~

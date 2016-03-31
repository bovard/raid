# Rogue AI Dungeon

[![Join the chat at https://gitter.im/bovard/raid](https://badges.gitter.im/bovard/raid.svg)](https://gitter.im/bovard/raid?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

A Rogue-like game based on the [battlecode](http://battlecode.org) API. We hope this game will be fun and help people prepare to compete in battlecode!

Check out the [latest version](http://bovard.github.io/raid/)!

We're going to program this during the 2016 [7DRL](http://7drl.org/) challenge. 


We'll do the work in two phases.

### Phase 1: Pre-7DRL (create and vet the API)

1. re-create the battlecode api (before 7DRL begins)
2. create a prototype using it 	(before 7DRL begins)

### Phase 2: During 7DRL (Create the game!)

1. create a rich UI
2. create and balance the game concept/rules
3. create and balance levels
4. create leaderboard

We believe this is in the [spirit](http://forums.roguetemple.com/index.php?topic=4885.0) of the 7DRL challenge.


## Local Development

Make sure you have node and npm installed.

```
npm install -g browserify
cd raid/
npm install
```

Then you simply build the project and start a simple server:
```
npm run build
npm run serve
```
Open your browser to localhost:8000 and tada! As you make changes you'll have to run `npm run build` again.

### Problems:

```
Error: EMFILE, open '/.../node_modules/react-bootstrap/package.json'
```
Your file limit it too low for browserify, fix it with:
```
ulimit -n 2560
```

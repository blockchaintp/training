day 1

09:30-10:00 Intros and Objectives

10:00-10:30 Hyperledger Sawtooth Overview

We introduce the basic concepts - this is an "explore the map" overview of the various moving parts.

10:30-11:00 Development environment setup

We help folks to get setup with their development environment

 * install docker & docker-compose
 * run local sawtooth
 * make code changes and reload
   * we will use the JS xo implementation in a folder in this repo
 * have a nice exercise for people who get this done in 5 mins to pass the time
 * get ip addresses of each person and write them on the board
 * create a dockerhub or quay.io account

11:00-12:00 Tic-Tac-Toe Demo

 * get folks to play xo with each other 
 * we will have our XO gui running as part of the container
 * get them to use the GUI to play games against each other
 * get them to use the CLI tool to look at games and make moves


12:00-13:00 Application Development Best Practices

Using the XO Transaction Family reference implementation highlight the key
considerations that need to be taken into when developing a new transaction
family


13:00-14:00 Lunch

14:00-16:00 Hands-on Session 2: Tic-Tac-Toe Deep Dive

 * Edit code in the tp
   * fix the bug where you can play yourself
 * Implement your own client
   * provide a skeleton client that they finish off
 * Deploy the new code with new version
   * update the settings to account for the tp
 * Push the new code to dockerhub

16:00-17:00 Introduce sextant and show deploying to production

 * create a cluster
 * deploy the xo 1.1 image they just pushed to production
 * update the settings to allow for xo 1.1


day 2

09:30-10:00 Day 1 recap
10:00-13:00 Hands-on Session 3: Develop Voting App
Extended session where we provide skeletal code for a voting application
derived from the settings-tp which will use and reinforce everything learned on

13:00-14:00 Lunch

14:00-16:00 Hands on: Seth Integration
Wrap up by showing how standard Ethereum developer tools such as truffle
and remix can be used with a Sawtooth network where seth-tp is deployed
thus opening up the world of Solidity/Ethereum

16:00-17:00 Running in production
Best practices
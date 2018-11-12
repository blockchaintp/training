---
title: Install
order: 1
---

Before we begin to create amazing blockchain applications - we will need to get our computers setup.

We will be developing transaction processors for Sawtooth.  To do this in development, we will be running a full sawtooth network locally on our local machines.

This makes local development really easy - you can edit code and check it works against a real, running version of Sawtooth all on your local machine.

Then, when the code is ready - you can deploy your transaction processors and clients into production.

## Code Editor

You will need some sort of code editor on your machine.  Something like Sublime Text or Visual Studio Code will do.  Any kind of text editor will do - if you already have a code development environment, you can use your preferred editor.

## Terminal

You will need a terminal application.  In Windows this is the `cmd` application.  On Mac and Linux, this is the `terminal` application.

## Git

You will need git installed on your machine - this means you can clone the repository used throughout the examples.

If you do not have the `git` command installed on your machine - visit [this page](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and install it for your platform.

## Docker

So we have have an easy experience in development and avoid having to install various depencies manually, we will make use of:

 * [Docker](https://www.docker.com/)
 * [Docker compose](https://docs.docker.com/v17.09/compose/overview/)

## Insall Docker

Install both docker and docker compose onto your machine using the following links:

 * [Install Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
 * [Install Docker for Windows](https://docs.docker.com/docker-for-windows/install/)
 * [Install Docker for Linux](https://docs.docker.com/install/linux/docker-ce/ubuntu/)

If you already have Docker installed on your machine - you can skip this step.

## Test Docker

To test the installation of Docker has worked - you can try the following command in your terminal application:

```bash
docker run --rm -ti busybox echo 'hello sawtooth'
```

You might see Docker downloading image layers.  At the end of the output for this command you should see:

```
hello sawtooth
```

## Clone repository

We will make use of the various code examples used throughout these workshops.  To download the repository - run the following command in your terminal application:

```bash
git clone https://github.com/catenasys/training
```



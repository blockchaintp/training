---
title: Push Image
order: 10
---

Now we have made some changes to the XO transaction processor, it's time to push this to production!

To do this - we build a Docker image and then push it to the [Dockerhub](https://hub.docker.com/).

This means we can then run it on live production servers.  Those servers would pull the image from the [Dockerhub](https://hub.docker.com/).

## Register Dockerhub account

You will need an account with the [Dockerhub](https://hub.docker.com/) - go there and make an account.

## Docker login

Next - we login our local Docker client using the account we just created:

```bash
docker login
```

## Build Docker image

We build our new shiny XO transaction processor by first getting into the source code folder:

```bash
cd code/xo
```

Next - we export our Dockerhub username to a variable.  Replace the following command with the username you just used to register for the dockerhub:

```bash
export DOCKERHUB_USERNAME=XXX
```

Then we run a `docker build` command.  We name the image using the `DOCKERHUB_USERNAME` variable we just exported:

```bash
docker build -t $DOCKERHUB_USERNAME/xotp .
```

This should produce an image that you can check with this command:

```bash
docker images
```

## Push Docker image

Now we push the image to our Dockerhub account:

```bash
docker push $DOCKERHUB_USERNAME/xotp
```






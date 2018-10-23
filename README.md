## Use this image

We have published this image on docker-hub. 

```bash
docker pull unleashorg/unleash-server
docker run -d -e DATABASE_URL=postgres://unleash_user:passord@10.200.229.44:5432/unleash unleashorg/unleash-server
```


Sepcifying secrets as environment variables is considered a bad security practice. Therfore you can instead specify a file where unleash can read the database url. This is done via the `DATABASE_URL_FILE` environment variable. 


## Work locally with this repo 
Start by cloning this repository. 

We have set up `docker-compose` to start postgres and the unleash server together. This makes it really fast to start up
unleash locally without setting up a database or node.

```bash
$ docker-compose build
$ docker-compose up
```

### Requirements
We are using docker-compose version 3.3 and it requires:

- Docker engine 17.06.0+
- Docker compose 1.14.0+

For more info, check out the compatibility matrix on Docker's website: [compatibility-matrix](
https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)



## Upgrade version
When we upgrade the `unleash-version` this project should be tagged with the same version number.

```bash
git tag -a 3.1.1 -m "upgrade to unleash-server 3.1.1"
git push origin master --follow-tags
```

This will automatically trigger docker-hub to build the new tag. 

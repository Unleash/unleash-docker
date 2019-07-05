## Use this image

We have published this image on docker-hub. 

```bash
docker pull unleashorg/unleash-server:3.1
docker run -d -e DATABASE_URL=postgres://user:pass@10.200.221.11:5432/unleash unleashorg/unleash-server
```

Specifying secrets as environment variables are considered a bad security practice. Therefore, you can instead specify a file where unleash can read the database secret. This is done via the `DATABASE_URL_FILE` environment variable.


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

You might also want to update the minor tag:

```bash
git tag -d 3.1
git push origin :3.1
git tag -a 3.1 -m "Update 3.1 tag"
git push origin master --follow-tags
```

This will automatically trigger docker-hub to build the new tag. 

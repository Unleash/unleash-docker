## Use Unleash Docker Image


**Useful links:**

- [Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-server/)
- [Unleash Helm Chart on artifacthub](https://artifacthub.io/packages/helm/unleash/unleash)

**Steps:**

1. Create a network by running `docker network create unleash`
2. Start a postgres database:

```sh
docker run -e POSTGRES_PASSWORD=some_password \
  -e POSTGRES_USER=unleash_user -e POSTGRES_DB=unleash \
  --network unleash --name postgres postgres
```

3. Start Unleash via docker:

```sh
docker run -p 4242:4242 \
  -e DATABASE_HOST=postgres -e DATABASE_NAME=unleash \
  -e DATABASE_USERNAME=unleash_user -e DATABASE_PASSWORD=some_password \
  -e DATABASE_SSL=false \
  --network unleash unleashorg/unleash-server
```

All configuration options [available in our documentation](https://docs.getunleash.io/docs/deploy/configuring_unleash). 


#### Docker-compose

1. Clone the [unleash-docker](https://github.com/Unleash/unleash-docker) repository.
2. Run `docker-compose build` in repository root folder.
3. Run `docker-compose up` in repository root folder.



## Work locally with this repo 
Start by cloning this repository. 

We have set up `docker-compose` to start postgres and the unleash server together. This makes it really fast to start up
unleash locally without setting up a database or node.

```bash
$ docker-compose build
$ docker-compose up
```

### Requirements
We are using docker-compose version 3.4 and it requires:

- Docker engine 17.09.0+
- Docker compose 1.17.0+

For more info, check out the compatibility matrix on Docker's website: [compatibility-matrix](
https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)



## Upgrade version
When we upgrade the `unleash-version` this project should be tagged with the same version number.

```bash
git tag -a 3.7.0 -m "upgrade to unleash-server 3.7.0"
git push origin master --follow-tags
```

You might also want to update the minor tag:

```bash
git tag -d 3.7
git push origin :3.7
git tag -a 3.7 -m "Update 3.7 tag"
git push origin master --follow-tags
```

This will automatically trigger a github actions which will build the new tag and push it to docker-hub. 

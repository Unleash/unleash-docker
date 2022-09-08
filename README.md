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

### User accounts
- Once started up, you'll have a user with 
  - `username: admin`
  - `password: unleash4all`

This user is an admin user and can be used to create other users, we do suggest you change the password :)

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
On some computers the database won't start in time for Unleash the first time you run this. If Unleash fails to reach the database, `docker-compose restart web` usually resolves the issue.

### Requirements
We are using docker-compose version 3.9 and it requires:

- Docker engine 19.03.0+
- Docker compose 2.0.0+

For more info, check out the compatibility matrix on Docker's website: [compatibility-matrix](
https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)

### Building the docker image
Building the docker image is now done in the [main repo for Unleash](https://github.com/Unleash/unleash).
This means that this repo is now just a docker-compose file, if you'd like to try the most recent version of unleash, update the image reference for the web service in docker-compose.yml

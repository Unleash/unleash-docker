## Unleash in Docker compose
This repo contains a docker compose file and an extended dockerfile for running the Unleash server. The docker compose file will start a database, the Unleash server, and an Unleash proxy.

The extended Unleash dockerfile is very small shim on top of [unleash/unleash](https://github.com/Unleash/unleash/) to include wait-for and allow the docker-compose configuration to ensure that we're not starting Unleash until the database is up and running.

#### Docker-compose

1. Clone the [unleash-docker](https://github.com/Unleash/unleash-docker) repository.
2. Run `docker-compose build` in repository root folder.
3. Run `docker-compose up` in repository root folder.

**Useful links:**

- [Docker image on dockerhub](https://hub.docker.com/r/unleashorg/unleash-server/)
- [Unleash Helm Chart on artifacthub](https://artifacthub.io/packages/helm/unleash/unleash)

### User accounts
- Once started up, you'll have a user with 
  - `username: admin`
  - `password: unleash4all`


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




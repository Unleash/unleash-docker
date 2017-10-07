## Run with docker
We have set up docker-compose to start postgres and the unleash server together. This makes it really fast to start up
unleash locally without setting up a database or node.

### Requirements
We are using docker-compose version 3.3 and it requires:

- Docker engine 17.06.0+
- docker-compose 1.14.0+

For more info, check out the compatibility matrix on Docker's website: [compatibility-matrix](
https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)

### Usage

```bash
$ docker-compose build
$ docker-compose up
```

## Use this image

We have published this image on docker-hub.

```bash
docker pull unleashorg/unleash-server:3.4
docker run -d -e DATABASE_URL=postgres://user:pass@10.200.221.11:5432/unleash unleashorg/unleash-server
```

Specifying secrets as environment variables are considered a bad security practice. Therefore, you can instead specify a file where unleash can read the database secret. This is done via the `DATABASE_URL_FILE` environment variable.


## Work locally with this repo
Start by cloning this repository.

We have set up `docker-compose` to start postgres and the unleash server together. This makes it really fast to start up
unleash locally without setting up a database or node.

```bash
$ npm run dev
```

### Testing google oauth
1. copy the oauth example file.
    ```bash
    $ cp docker-compose.google.example.yml docker-compose.google.yml
    ```
2. expose port 4242 to the internet. I use [ngrok](ngrok.com)
    ```bash
    $ ngrok http 4242 # this should output something like https://20ae209752e23.ngrok.io
    ```
3. [Create your own oauth credentials](https://console.developers.google.com/apis/credentials). use your ngrok url + '/api/auth/callback' for the callback, EG: https://20ae209752e23.ngrok.io/api/auth/callback
4. add your oauth information to docker-compose.google.yml
5. Start the server locally using docker-compose
    ```bash
    $ npm run dev:google
    ```
6. You should be able to login using google.

### Requirements
We are using docker-compose version 3.3 and it requires:

- Docker engine 17.06.0+
- Docker compose 1.14.0+

For more info, check out the compatibility matrix on Docker's website: [compatibility-matrix](
https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix)



## Upgrade version
When we upgrade the `unleash-version` this project should be tagged with the same version number.

```bash
git tag -a 3.4.2 -m "upgrade to unleash-server 3.4.2"
git push origin master --follow-tags
```

You might also want to update the minor tag:

```bash
git tag -d 3.4
git push origin :3.4
git tag -a 3.4 -m "Update 3.4 tag"
git push origin master --follow-tags
```

This will automatically trigger docker-hub to build the new tag.

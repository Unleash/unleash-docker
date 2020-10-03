* [Use this image](#use-this-image)
* [Environment Variables](#environment-variables)
  * [Example: connecting with the node-sdk](#example-connecting-with-the-node-sdk)
* [Work locally with this repo](#work-locally-with-this-repo)
  * [Testing google oauth](#testing-google-oauth)
  * [Requirements](#requirements)
* [Upgrade version](#upgrade-version)

## Use this image

We have published this image on docker-hub.

```bash
docker pull unleashorg/unleash-server:3.4
docker run -d -e DATABASE_URL=postgres://user:pass@10.200.221.11:5432/unleash unleashorg/unleash-server
```

Specifying secrets as environment variables are considered a bad security practice. Therefore, you can instead specify a file where unleash can read the database secret. This is done via the `DATABASE_URL_FILE` environment variable.

## Environment Variables
```yml
#######################################################
# Database Connection
#######################################################
# Database to connection string
DATABASE_URL: postgres://postgres:unleash@db/postgres
#######################################################
# Google Oauth
# create an oauth credential here: https://console.developers.google.com/apis/credentials
#######################################################
# Google client id for oauth
GOOGLE_CLIENT_ID: # insert your id here
GOOGLE_CLIENT_SECRET: # insert your secret here
# Callback url, should end in 'api/auth/callback'. In this example, the
# BASE_URI_PATH is unleash, so the url is:
# <my domain>/<BASE_URI_PATH>/api/auth/callback
GOOGLE_CALLBACK_URL: https://mywebsite.com/unleash/api/auth/callback
# Regular expression to check for valid email addresses. If you want to
# simply list explicit emails consider something like this:
# ^(alice@mywebsite\.com|bob@mywebsite\.com|charlie@mywebsite\.com)$
ALLOWED_USERS_REGEX: ^.+@mywebsite.com$

# A shared secret that is required to use api from the an sdk, see the example below
SHARED_SECRET: asdfasdf
# base uri to serve the service. Useful if this is behind a reverse proxy or load balancer.
BASE_URI_PATH: /unleash

```
### Example: connecting with the node-sdk
```js
const { initialize } = require("unleash-client");
const initializeUnleash = () =>
    new Promise((resolve, reject) => {
      const instance = initialize({
        url: `https://mywebsite.com/unleash/api`,
        appName: "my app",
        instanceId: "app",
      });
      instance.on("error", (error) => {
        console.error('Error connecting', error)
        // reject(error) // You could reject this if you wanted, but there may be errors unrelated to registered.
      });
      instance.on("registered", (clientData) => {
        resolve(instance);
      });
    });

```
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

## The Resonating API 💾

## Description :memo:

This is a project for my course Multimedia & Creative Technologies at the Erasmus University College Brussels. I am asked to develop an **[open source API](https://expressjs.com/)**, that uses a **[database](https://knexjs.org/)**. The subject for this project was a Jukebox site using the API to store its users and songs.

#

## Relevance :+1:

For me it's relevant not to only learn how to make an API, that uses a database, but also because I can experiment with different technologies, such as [Docker](https://www.docker.com/),[ knex.js](https://knexjs.org), [Jest](https://jestjs.io/), ... . I hope this can be used as a basic setup or as a tutorial for people who also want to learn those technologies.

#

## Getting Started :rocket:

A step-by-step guide to launch my project.

1. Start by creating an .env file, based on the .example-env file.
2. Check if the docker-compose.yml & Dockerfile fits your needs.
3. Open a command prompt and make sure the path links to the projects folder. Use the next command to build and run the docker container: `docker-compose up --build`.

#

## Routing :speech_balloon:

```http
GET /
```

```javascript
{
  "users" : array,
  "songs" : array,
}
```

#

#### _USER ROUTERS_

```http
GET /users
```

| Parameter | Type     | Description                                       |
| :-------- | :------- | :------------------------------------------------ |
| `param`   | `string` | **Required** The parameter used to search a user. |
| `value`   | `string` | **Required** The value to search users on.        |

```http
POST /users
```

| Parameter | Type     | Description                                              |
| :-------- | :------- | :------------------------------------------------------- |
| `user`    | `object` | **Required** Object containing all the user information. |

```http
PATCH /users
```

| Parameter | Type      | Description                                               |
| :-------- | :-------- | :-------------------------------------------------------- |
| `param`   | `string`  | **Required** The parameter that should be changed.        |
| `value`   | `string`  | **Required** The value that the parameter will change to. |
| `USER_ID` | `integer` | **Required** The ID of the targeted user.                 |

```http
DELETE /users
```

| Parameter | Type      | Description                               |
| :-------- | :-------- | :---------------------------------------- |
| `user`    | `object`  | **Required** The content of the user.     |
| `USER_ID` | `integer` | **Required** The ID of the targeted user. |

#

#### _SONG ROUTERS_

```http
GET /songs
```

| Parameter | Type     | Description                                       |
| :-------- | :------- | :------------------------------------------------ |
| `param`   | `string` | **Required** The parameter used to search a song. |
| `value`   | `string` | **Required** The value to search song on.         |

```http
POST /songs
```

| Parameter | Type     | Description                                              |
| :-------- | :------- | :------------------------------------------------------- |
| `song`    | `object` | **Required** Object containing all the song information. |

```http
PATCH /songs
```

| Parameter | Type      | Description                                               |
| :-------- | :-------- | :-------------------------------------------------------- |
| `param`   | `string`  | **Required** The parameter that should be changed.        |
| `value`   | `string`  | **Required** The value that the parameter will change to. |
| `SONG_ID` | `integer` | **Required** The ID of the targeted song.                 |

```http
DELETE /songs
```

| Parameter | Type      | Description                               |
| :-------- | :-------- | :---------------------------------------- |
| `song`    | `object`  | **Required** The content of the song.     |
| `SONG_ID` | `integer` | **Required** The ID of the targeted song. |

#

### _Example Objects_

##### USER OBJECT

```javascript
{
  "username" : string,
  "password" : string,
  "email": string,
  "spotifyID": string
}
```

##### SONG OBJECT

```javascript
{
  "title" : string,
  "artist" : string,
}
```

### _STATUS CODES_

| Status Code | Description             |
| :---------- | :---------------------- |
| 200         | `OK`                    |
| 400         | `BAD REQUEST`           |
| 404         | `NOT FOUND`             |
| 500         | `INTERNAL SERVER ERROR` |

#

## Roadmap :round_pushpin:

-   [x] User Database
-   [x] User Routes
-   [x] Song Database
-   [x] Song Routes
-   [x] Persistent Data
-   [ ] Connection between users and songs
-   [ ] Routes to get connections

#

## Status :white_check_mark:

I am currently working on this project untill 24 December 2021. Afterwards I wont be able to work any longer on this project.

#

## Contribution :trophy:

-   Bug rapporting is always welcome.
-   Suggesting new features.

#

## Code of Conduct :black_nib:

Any violation of the following rules will result in a suspension.

-   **Be kind**
    _Giving constructive feedback is good. Make sure to evaluate what you're doing before u post_

-   **Respect other humans**
    _This includes: hate speech, discriminatory language based on gender, religion, ethnicity or sex_

#

## Author :eyes:

My name is **Gauthier Bossuyt** and I am a third year Multimedia and Creative Technologies student at the Erasmus University College Brussels. During my education, I had courses in web design and development, motion design, live visuals and motion capture. If you have any questions feel free to **[contact me](mailto:gauthier.bossuyt@student.ehb.be)**.

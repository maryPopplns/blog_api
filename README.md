# Blog API

REST API for a blog hosting site.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

| Variable | Description |
| :------- | :---------- |
| `ENV`    | prod / dev  |

| Variable   | Description       |
| :--------- | :---------------- |
| `ATLAS_DB` | MongoDB Atlas url |

| Variable     | Description                                        |
| :----------- | :------------------------------------------------- |
| `JWT_SECRET` | 'npm run newsecret' to generate new secret in .env |

| Variable           | Description      |
| :----------------- | :--------------- |
| `GOOGLE_CLIENT_ID` | google client id |

| Variable               | Description          |
| :--------------------- | :------------------- |
| `GOOGLE_CLIENT_SECRET` | google client secret |

## API Reference

#### create blog post

```http
  POST /blog/create
```

#### Update blog post

```http
  PUT /blog/:id/update
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of blog post to update |

#### Delete blog post

```http
  DELETE /blog/:id/delete
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of blog post to delete |

#### Like blog post

```http
  PUT /blog/:id/increment
```

| Parameter | Type     | Description                           |
| :-------- | :------- | :------------------------------------ |
| `id`      | `string` | **Required**. Id of blog post to like |

#### Unlike blog post

```http
  PUT /blog/:id/decrement
```

| Parameter | Type     | Description                             |
| :-------- | :------- | :-------------------------------------- |
| `id`      | `string` | **Required**. Id of blog post to unlike |

#### Create blog post comment

```http
  POST /blog/:id/comment
```

| Parameter | Type     | Description                              |
| :-------- | :------- | :--------------------------------------- |
| `id`      | `string` | **Required**. Id of blog post to comment |

#### Delete blog post comment

```http
  DELETE /blog/:id/:comment/delete
```

| Parameter | Type     | Description                   |
| :-------- | :------- | :---------------------------- |
| `id`      | `string` | **Required**. Id of blog post |
| `comment` | `string` | **Required**. Id of comment   |

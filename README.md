<p align="center">
<img src="https://i.imgur.com/Kvxbc8A.png" alt="Lungo Logo" width="500" height="150"/>
</p>

<p align="center">⚡A minimalist and high-performance HTTP web framework that makes it easy to build APIs with speed and efficiency.</p>

# Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Documentation](#documentation)
  - [Application](#application)
    - [Methods](#methods)
      - [delete()](#appdeletepath-handler)
      - [get()](#appgetpath-handler)
      - [listen()](#applistenport)
      - [patch()](#apppatchpath-handler)
      - [post()](#apppostpath-handler)
      - [put()](#appputpath-handler)
      - [on()](#apponeventname-callback)
      - [use()](#appusehandler)
  - [Request](#request)
    - [Properties](#properties)
      - [baseUrl](#reqbaseurl)
      - [body](#reqbody)
      - [cookies](#reqcookies)
      - [files](#reqfiles)
      - [ip](#reqip)
      - [method](#reqmethod)
      - [originalUrl](#reqoriginalurl)
      - [params](#reqparams)
      - [path](#reqpath)
      - [query](#reqquery)
    - [Methods](#methods-1)
      - [accepts()](#reqacceptstypes)
      - [get()](#reqgetfield)
      - [is()](#reqistype)
  - [Response](#response)
    - [Properties](#properties-1)
      - [headersSent](#resheaderssent)
    - [Methods](#methods-2)
      - [cookie](#rescookiename-value-options)
      - [download](#resdownloadpath)
      - [end](#resend)
      - [get](#resgetfield)
      - [json](#resjsonbody)
      - [redirect](#resredirecturl)
      - [render](#resrenderview-locals)
      - [send](#ressendbody)
      - [sendFile](#ressendfilepath)
      - [sendStatus](#ressendstatusstatuscode)
      - [set](#ressetfield-value)
      - [status](#resstatuscode)
      - [type](#restypetype)
  - [Router](#router)
    - [Methods](#methods-3)
      - [METHOD](#routermethodpath-handler)
      - [use](#routerusehandler)
  - [Middlewares](#middlewares)
    - [uploadFile()](#uploadfileoptions)
- [Contributing](#contributing)
- [License](#license)

# Installation

Using npm:

```js
npm install lungojs
```

Using yarn:

```js
yarn add lungojs
```

Using pnpm:

```js
pnpm add lungojs
```

# Basic Usage

```ts
import { Lungo, Request, Response } from 'lungojs'

const app = new Lungo()

app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello world!')
})

app.listen(3000)
```

# Documentation

## Application

### Methods

### app.delete(path, handler)

Routes HTTP DELETE requests to specified path with the given handler.

```ts
app.delete('/', (req: Request, res: Response) => {
  res.send('DELETE request')
})
```

### app.get(path, handler)

Routes HTTP GET requests to specified path with the given handler.

```ts
app.get('/', (req: Request, res: Response) => {
  res.send('GET request')
})
```

### app.listen(port)

Creates a HTTP server on given port.

```ts
app.listen(3000)
```

### app.patch(path, handler)

Routes HTTP PATCH requests to specified path with the given handler.

```ts
app.patch('/', (req: Request, res: Response) => {
  res.send('PATCH request')
})
```

### app.post(path, handler)

Routes HTTP POST requests to specified path with the given handler.

```ts
app.post('/', (req: Request, res: Response) => {
  res.send('POST request')
})
```

### app.put(path, handler)

Routes HTTP PUT requests to specified path with the given handler.

```ts
app.put('/', (req: Request, res: Response) => {
  res.send('PUT request')
})
```

### app.onError(errorHandler)

Executes given callback when application throws an error.

```ts
app.onError((req: Request, res: Response, error: unknown) => {
  res.send('Error received: ' + error.message)
})
```

### app.use(handler)

> Most of ExpressJS middleware packages works well with Lungo.

Executes given handler before execute requested route handler.

```ts
app.use((req: Request, res: Response, next: INextFunc) => {
  console.log('Middleware executed!')
  next() // execute the next handler
})
```

## Request

### Properties

### req.baseUrl

The URL path on which a router instance was mounted.

```ts
const userRouter = new Router()

userRouter.get('/posts', (req: Request, res: Response) => {
  const baseUrl = req.baseUrl // /user
  res.send('user posts')
})

app.use('/user', userRouter)
```

### req.body

An object which is created by submitted data in the request body.

```ts
app.get('/', (req: Request, res: Response) => {
  const body = req.body
  res.send(body)
})
```

### req.cookies

When using [cookie-parser](https://www.npmjs.com/package/cookie-parser) middleware, this property is an object that contains cookies sent by the request. If the request contains no cookies, it defaults to {}.

```ts
// Cookie: packageName=lungo
console.log(req.cookies.packageName)
// => "lungo"
```

### req.files

When using built-in [uploadFile](#uploadfileoptions) middleware, this property is an object that contains files sent by the request.

```ts
// Content-Type: multipart/form-data
// Content-Disposition: attachment; filename="logo"
console.log(req.files.logo)
```

### req.ip

Remote IP address of the request.

```ts
// Host: "localhost:3000"
console.log(req.ip)
// => "127.0.0.1"
```

### req.method

Contains HTTP method of the received request. Like: GET, POST etc.

### req.originalUrl

Contains original url of the received request.

```ts
// GET /user/posts?id=12
console.log(req.originalUrl)
// => "/user/posts?id=12"
```

### req.params

This property is an object that contains parameters of received request.

```ts
// GET /users/242/posts/10
app.get('/users/:userId/posts/:postId', (req: Request, res: Response) => {
  res.send({
    userId: req.params.userId, // 242
    postId: req.params.postId // 10
  })
})
```

### req.path

This property contains path part of the received request url.

```ts
// GET /users?id=242
console.log(req.path)
// => "/users"
```

### req.query

This property is an object that containing properties for each query string parameter in the requested url.

```ts
// GET /users?id=242
app.get('/users', (req: Request, res: Response) => {
  const userId = req.query.userId // 242
  res.send(userId)
})
```

### Methods

### req.accepts(...types)

Checks if the specified content types are acceptable, based on the request’s Accept HTTP header field. If the specified content types are acceptable returns the content type, if all of the specified content types are not acceptable returns false.

```ts
// Accept: */*
req.accepts('application/json')
// => "application/json"
req.accepts('text/html')
// => "text/html"

// Accept: text/html, application/xml
req.accepts('application/json', 'application/xml')
// => "application/xml"
req.accepts('application/json')
// => false
```

### req.get(field)

Returns the specified HTTP request header field.

```ts
// With Content-Type: application/json; charset=utf-8
req.get('Content-Type')
// => "application/json"
```

### req.is(type)

Returns the matching content type if the incoming request’s “Content-Type” HTTP header field matches the MIME type specified by the type parameter. If the request has no body, returns null. Returns false otherwise.

```ts
// With Content-Type: text/html; charset=utf-8
req.is('text/html')
// => "text/html"
req.is('application/json')
// => false
```

## Response

### Properties

### res.headersSent

Boolean property that indicates if the app sent HTTP headers for the response.

```ts
app.get('/', (req: Request, res: Response) => {
  console.log(res.headersSent) // => false
  res.send('OK')
  console.log(res.headersSent) // => true
})
```

### Methods

### res.cookie(name, value, options?)

Sets cookie name to value.

The options parameter is an object that can have the following properties.

| Property |       Type        | Description                                                                                 |
| :------: | :---------------: | :------------------------------------------------------------------------------------------ |
|  domain  |      String       | Domain name for the cookie. Defaults to the domain name of the app.                         |
|  encode  |     Function      | A synchronous function used for cookie value encoding. Defaults to encodeURIComponent.      |
| expires  |       Date        | Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.   |
| httpOnly |      Boolean      | Flags the cookie to be accessible only by the web server.                                   |
|  maxAge  |      Number       | Convenient option for setting the expiry time relative to the current time in milliseconds. |
|   path   |      String       | Path for the cookie. Defaults to “/”.                                                       |
| priority |      String       | Value of the “Priority” Set-Cookie attribute.                                               |
|  secure  |      Boolean      | Marks the cookie to be used with HTTPS only.                                                |
|  signed  |      Boolean      | Indicates if the cookie should be signed.                                                   |
| sameSite | Boolean or String | Value of the “SameSite” Set-Cookie attribute.                                               |

You can get more information from [here](https://www.npmjs.com/package/cookie#options-1).

Example:

```ts
app.get('/', (req: Request, res: Response) => {
  res.cookie('packageName', 'lungo', { secure: true })
  res.end()
})
```

### res.download(path)

Transfers the file at path as an “attachment”. Browsers will prompt the user for download.

```ts
app.get('/download', (req: Request, res: Response) => {
  const filePath = __dirname + '/file.txt'
  res.download(filePath)
})
```

### res.end()

Ends the lifecycle for received request. This method is actually comes from Node core. Click [here](https://nodejs.org/api/http.html#http_response_end_data_encoding_callback) for more information.

```ts
res.end()
```

### res.get(field)

Returns the HTTP response header specified by field.

```ts
res.get('content-type')
// => "application/json"
```

### res.json(body)

Sends body to the client as a json then ends the request.

```ts
res.json({
  packageName: 'lungo'
})
```

### res.redirect(url)

Redirects to the given URL and sets status code to 302 (Found).

```ts
res.redirect('/user/settings')
```

### res.render(view, locals?)

> Lungo uses [Pug](https://pugjs.org/) as its view engine.

Renders a view and sends the rendered HTML string to the client.

Optional parameters:

- locals: an object whose properties define local variables for the view.

Example usage:

view.pug:

```pug
p Package name: #{packageName}
```

index.ts:

```ts
app.get('/', (req: Request, res: Response) => {
  const view = __dirname + '/view.pug'
  res.render(view, { packageName: 'lungo' })
})
```

### res.send(body)

Sends the HTTP response.

This method automatically assigns the Content-Length and Content-Type HTTP response header fields.

```ts
res.send({ message: 'Hello world!' })
res.send(Buffer.from('lungo'))
res.send('<h1>Lungo</h1>')
```

### res.sendFile(path)

Transfers the file at the given path. Sets the Content-Type response HTTP header field based on the filename’s extension.

```ts
app.get('/', (req: Request, res: Response) => {
  const image = __dirname + '/image.png'
  res.sendFile(image)
})
```

### res.sendStatus(statusCode)

Sets the response HTTP status code to statusCode and sends the registered status message as the text response body. If an unknown status code is specified, the response body will just be the code number.

```ts
res.sendStatus(201)
// => "CREATED"
```

### res.set(field, value)

Sets the response’s HTTP header field to value. To set multiple fields at once, pass an object as the parameter.

```ts
res.set('Content-Type', 'text/html')

res.set({
  'Content-Type': 'text/html',
  'X-Powered-By': 'lungo'
})
```

### res.status(code)

Sets the HTTP status for the response.

```ts
res.status(404).send('Not found')
```

### res.type(type)

Sets the Content-Type HTTP header to the MIME type as determined by the specified type.

```ts
res.type('text/html')
// => "text/html"

res.type('application/json')
// => "application/json"

res.type('image/png')
// => "image/png"
```

## Router

### Methods

### router.METHOD(path, handler)

The router.METHOD() methods provide the routing functionality, where METHOD is one of the HTTP methods, such as GET, POST, PUT, DELETE, PATCH.

```ts
const userRouter = new Router()

userRouter.get('/hello', (req: Request, res: Response) => {
  res.send('Hello from user router!')
})

app.use('/user', userRouter)

// GET /user/hello
// => "Hello from user router!"
```

### router.use(handler)

> Most of ExpressJS middleware packages works well with Lungo.

Executes given handler before execute requested route handler.

```ts
const userRouter = new Router()

userRouter.use((req: Request, res: Response, next: INextFunc) => {
  console.log('Router middleware executed!')
  next() // execute the next handler
})

userRouter.get('/hello', (req: Request, res: Response) => {
  console.log('Hello from user router!')
  res.end()
})

app.use('/user', userRouter)

// GET /user/hello
// => "Router middleware executed!"
// => "Hello from user router!"
```

## Middlewares

### uploadFile(options?)

> You can get more information about options from [here](https://www.npmjs.com/package/formidable#options).

The uploadFile() middleware provides the uploading file functionality to your route.

```ts
app.post('/upload-file', [uploadFile()], (req: Request, res: Response) => {
  res.send({
    files: req.files, // contains informations about uploaded files, such as filepath etc.
    fields: req.body // contains form fields if they sent with form data
  })
})
```

# Contributing

1. Fork this repository.
2. Create a new branch with feature name.
3. Create your feature.
4. Commit and set commit message with feature name.
5. Push your code to your fork repository.
6. Create pull request.

# License

Lungo is [MIT licensed](https://github.com/canccevik/lungo/blob/master/LICENSE).

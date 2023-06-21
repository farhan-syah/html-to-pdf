# HTML to PDF

A standalone, fast, and portable HTML to PDF generator. Use it in any of your project. Just pass the HTML string, and you'll get a PDF as a result.

### Why use this

- Standalone - It can run separately from your main applications, regardless which language or framework you use.
- Easy to use - Just send a HTTP POST request from your client, application, or server.
- High availabilty - Using [puppeteer-cluster](https://github.com/thomasdondorf/puppeteer-cluster), the puppeteer instances can be restarted in case of crash
- Container support - Deploy and scale easily

## Installation

Install using your favorite package manager:

```sh
pnpm install
npm install
yarn install
```

Run it:

```sh
pnpm run start
npm start
yarn start
```

## Usage

Send a HTTP POST request with the body:

```json
{
  "content": "<h1>Your content here</h1>",
  "options": {
    "format": "A4",
    "margin": {
      "top": 10,
      "left": 10
    }
  }
}
```

## Parameters

| Key       | Type                                                                         | Description                                                                                                                               |
| --------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `content` | string (required)                                                            | Any HTML string will do. Most of the time, you'll get the PDF exactly as you see in your browser. You can use css class and styles in it. |
| `options` | Puppeteer.[PDFOptions](https://pptr.dev/api/puppeteer.pdfoptions) (optional) | You can pass the options to configure the Puppeteer page                                                                                  |

## Environment Value

| Key               | Description                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CONCURRENCY`     | [puppeteer-cluster concurrency](https://www.npmjs.com/package/puppeteer-cluster#concurrency-implementations) options -> 1:PAGE, 2:CONTEXT, 3:BROWSER. Default: `2` |
| `MAX_CONCURRENCY` | Max concurrency number. (Max number of tabs/pages). Default: `5`                                                                                                   |

## Docker Image

You can configure and build your own image, or run it directly:

```sh
docker run -p 3000:3000 farhansyah/html-to-pdf
```

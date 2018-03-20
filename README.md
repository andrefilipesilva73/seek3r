# seek3r

Read markup info from an HTML remote resource.

```js
{
    "treeDeep": 22,
    "tagCount": {
        "html": 1,
        "head": 1,
        "title": 1,
        "meta": 6,
        "link": 7,
        "script": 60,
        "body": 1,
        "noscript": 2,
        "iframe": 1,
        "div": 335,
        "header": 5,
        "nav": 4,
        "button": 7,
        "span": 284,
        "ul": 139,
        "li": 1430,
        (...)
```

Install Globally and Run:

```sh
npm start
```

Simple usage:

```js
seek3r
```

With Remote HTML resource URL:

```js
seek3r [url from remote resource]
```

With Remote HTML resource URL and Open Results file at the end flag:

```js
seek3r [url from remote resource] [y/n]
```

Test:

```sh
npm test
```

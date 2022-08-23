# netlify-record-updater

A remote record updater for Netlify DNS that allows you to update your `A` records with a single command.
This is useful if you want to keep your 'A' DNS record up to date with a dynamic IP address.

For example if you have a server at home and want to acces it, you can access it with `home.mydomain.com` if you run this script on your home machine (for example a raspberry pi) every X minutes using CRON.

## CLI Usage

### Installation

```bash
npm install -g netlify-record-updater
```

or

```bash
yarn add -g netlify-record-updater
```

To update the record using the current public IP:

```bash
netlify-record-updater home.test.com <NETLIFY_API_TOKEN>
```

To update the record using a custom IP:

```bash
netlify-record-updater home.test.com <NETLIFY_API_TOKEN> --ip "1.2.3.4"
```

Replace `<NETLIFY_API_TOKEN>` by your [Netlify API token (Personal Token)](https://app.netlify.com/user/applications).

For help:

```bash
netlify-record-updater --help
```

## ES Module Usage

### Installation

```bash
npm install netlify-record-updater
```

or

```bash
yarn add netlify-record-updater
```

```js
import { updateRecord } from "netlify-record-updater";

updateRecord("home.test.com", "<NETLIFY_API_TOKEN>");
// or
updateRecord("home.test.com", "<NETLIFY_API_TOKEN>", "1.2.3.4");
```

### Publish

```
yarn publish
```

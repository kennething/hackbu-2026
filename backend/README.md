# Backend

written with express and socket.io

## Project Setup

1. ensure node.js and openssl are installed

2. select backend directory

```sh
cd backend
```

3. install node modules

```sh
npm install
```

4. create https certificates

```sh
openssl req -new -x509 -nodes -out cert.pem -keyout key.pem -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -days 14 -subj '/CN=<ip>'
```

where `<ip>` is your local network IP address, which you can find somewhere probably. check ur wifi settings idk

5. create .env

```sh
FRONTEND_URL=https://<ip>:3000
```

6. run the server

```sh
npm run serve
```

or, run with watch enabled:

```sh
npm run dev
```

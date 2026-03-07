# Frontend Setup

1. ensure node.js is installed

2. select frontend directory

```sh
cd frontend
```

3. install node modules

```sh
npm install
```

4. create a .env file

```sh
NUXT_PUBLIC_BACKEND_URL=https://<ip>:8008 # dont append /
```

where `<ip>` is your local network IP address, which you can find somewhere probably. check ur wifi settings idk

5. run the development server on your network

```sh
npm run dev -- --https --host=<ip>
```

you can now open the link on your phone or whatever.

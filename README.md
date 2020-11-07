# Mikro-ORM Reproductions

## Installation

```
yarn
```

## Environment

Environment variables can be changed in the `.env` file, which are then used in
the `mikro-orm.config.ts` file to connect to the database.

## Commands

### With Docker Compose

If you have have docker-compose installed you can use the docker versions of the
commands, which runs a MySQL docker container as part of the setup, meaning no
installation of MySQL is required on your system. Just docker is needed.

**Creating migrations**
`yarn migration:create`

**Running migrations**
`yarn migration:up`

**Rolling back a single migration**
`yarn migration:down`

**Running tests**
`yarn test`

**Running tests (and watch)**
`yarn test:watch`

---

### Without Docker Compose

**Creating migrations**
`yarn mikro-orm migration:create -d`

**Running migrations**
`yarn mikro-orm migration:up`

**Rolling back a single migration**
`yarn mikro-orm migration:down`

**Running tests**
`yarn jest --run-in-band`

**Running tests (and watch)**
`yarn jest --run-in-band --watch`

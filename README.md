# Project: Very simple RESTful API application

Very simple RESTful API application made with express and mongodb - not secured!

## Prerequisite:
 - MongoDB running on default port
 - db: hairdresser
 - document: clients (id: Number, name: String, surname: String, email: String, phone: String, deleted: Boolean)

## Getting started:
```sh
# run
$ git clone https://github.com/ngxpoland/s01e03-api1
$ cd s01e03-api1
$ npm i
$ chmod +x ./start.sh
$ ./start.sh
# output:
# Hairdresser: RESTful API Backend App - listening on port 3000


# testing
$ curl localhost:3000/

# output:
# This is express RESTful API - do not use in production ;)
```
## License:
MIT
all: clean install build

clean:
	npm run clear

install:
	npm install && bower install

build:
	npm run build

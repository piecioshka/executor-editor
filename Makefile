all: clean npm webpack bower

clean:
	npm run clear

npm:
	npm install

webpack:
	webpack -p

bower:
	bower install

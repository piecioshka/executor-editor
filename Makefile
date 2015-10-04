all: clean npm bower webpack

clean:
	npm run clear

npm:
	npm install

bower:
	bower install

webpack:
	webpack -p

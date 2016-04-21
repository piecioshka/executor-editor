all: clean npm bower build

clean:
	npm run clear

npm:
	npm install

bower:
	bower install

build:
	npm run build

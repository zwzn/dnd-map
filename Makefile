all: npm
	packr build

npm: clean
	npm run build --prefix web

clean:
	rm -rf web/dist dnd-map
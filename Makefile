all: build

build:
	jekyll build

docker:
	docker pull jekyll/jekyll:builder
	docker run -v `pwd`:/srv/jekyll jekyll/jekyll:builder jekyll build
	docker build -t tinco/blog.tinco.nl .
	docker push tinco/blog.tinco.nl

docker-build-env:
	docker build -t tinco/tinco.nl-buildenv docker/build-env
	docker push tinco/tinco.nl-buildenv
        
.PHONY: all test clean docker

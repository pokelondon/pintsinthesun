install:
	npm install

serve:
	grunt serve

deploy:
	s3_website push --site src

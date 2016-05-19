install:
	npm install

serve:
	gulp

deploy:
	s3_website push --site src

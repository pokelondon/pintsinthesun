# Development

## Installation

You'll need [node](https://nodejs.org/en/) installed.

First install the packages required by the app

```
$ npm install
```

Then you can run a local development server available at `http://localhost:8000` using

```
$ grunt serve
```

# Deployment

To deploy the site you just need to host the contents of the `src` directory.

If you want to deploy the app to `S3` you need to have [Ruby](https://www.ruby-lang.org/en/), [RubyGems](https://rubygems.org/) and [Java](https://www.java.com/en/) installed. Once you have those installed you can do:

```
$ gem install s3_website
```

Then to deploy the site:

```
$ s3_website push --site src
```

Note: `s3_website.yml` is required for pushing to S3

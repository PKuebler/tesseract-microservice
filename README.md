Tesseract OCR Microservice
=======

Detect Text on Images.

# Install

	docker-compose build

# Run

	docker-compose up

# Use

- Redis Queue
- API Service
- Worker

# Endpoints

## POST /url

	POST /url

### JSON Request

	{
		url: "http://....jpg",
		formats: ["hocr", "txt", "pdf", "tsv"],
		contrast: 0.5,
		lang: ["deu", "eng"]
	}

- **url**: URL to Image
- **formats**:
	- *hocr* [Wikipedia HOCR](https://en.wikipedia.org/wiki/HOCR)
	- *txt* plain text
	- *pdf* with text
	- *tsv* [Tesseract Documentation](https://github.com/tesseract-ocr/tesseract/wiki/Command-Line-Usage#tsv-output-currently-available-in-305-dev-in-master-branch-on-github)

## POST /file

	POST /file

## MIT
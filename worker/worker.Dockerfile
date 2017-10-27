FROM ubuntu:16.04

# Install Teseract
RUN apt-get update && apt-get install -y software-properties-common && add-apt-repository -y ppa:alex-p/tesseract-ocr
RUN apt-get update && apt-get install -y tesseract-ocr tesseract-ocr-deu tesseract-ocr-eng

# Install Node.js
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install --yes nodejs

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app

RUN npm install

COPY . /app

CMD ["npm", "start"]
#CMD ["tesseract", "image.jpg", "phototest", "-l deu", "--psm 1", "--oem 2", "txt", "pdf", "hocr"]
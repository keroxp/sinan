FROM gikou:latest as gikou

FROM node:10.15-alpine as build
WORKDIR /workspace
RUN apk update --no-cache && apk add git bash curl build-base
COPY package.json yarn.lock /workspace/
RUN yarn install
COPY . /workspace
RUN yarn run tsc

FROM node:10.15-alpine
WORKDIR /workspace
COPY --from=gikou /gikou /gikou
COPY --from=build /usr /usr
COPY --from=build /workspace /workspace
RUN apk update --no-cache && apk add tini
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "/workspace/dist/usi-server.js"]
ENV SINAN_USI_ENGINE_BIN=/gikou/release
ENV DEBUG=sinan*
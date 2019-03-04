FROM alpine:3.9 as build
WORKDIR /build
RUN apk update --no-cache && apk add git bash curl unzip ca-certificates build-base
RUN git clone https://github.com/gikou-official/Gikou
RUN cd /build/Gikou && make release
RUN wget https://github.com/gikou-official/Gikou/releases/download/v2.0.2/gikou2_win.zip
RUN unzip gikou2_win.zip -d /build/Gikou/bin

FROM alpine:3.9
WORKDIR /gikou
RUN apk update --no-cache && apk add tini
COPY --from=build /usr /usr
COPY --from=build /build/Gikou/bin /gikou
ENTRYPOINT ["/sbin/tini", "--"]
CMD /gikou/release
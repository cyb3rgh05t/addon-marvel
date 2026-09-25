FROM denoland/deno:alpine-2.1.9

WORKDIR /app

COPY . .

RUN deno cache main.js

ENV PORT=7777
EXPOSE 7777

USER deno

CMD ["deno", "task", "start"]
FROM node:8 as build-env
COPY . /tx-debugger/
WORKDIR /tx-debugger
RUN npm install

FROM node:8-slim
COPY --from=build-env /tx-debugger /tx-debugger
WORKDIR /tx-debugger
EXPOSE 3101
CMD ["npm", "run", "start"]

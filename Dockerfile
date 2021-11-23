FROM node:alpine as builder

WORKDIR /app

COPY src src
COPY package.json package-lock.json tsconfig.json ./
# Generate production node_modules for final image
RUN npm i --production
RUN cp -R node_modules prod_node_modules
# Install all node modules for compiling
RUN npm i
RUN npm run build

FROM node:alpine

WORKDIR /app
COPY --from=builder /app/dist dist
COPY --from=builder /app/prod_node_modules node_modules
COPY package.json package-lock.json robots.txt ./
ENV NODE_ENV "production"
ENTRYPOINT ["npm", "start"]

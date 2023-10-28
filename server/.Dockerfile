# Dirty dockerfile build, i.e. uses code from local system instead of pulling
# from remote repo to build.
# 
# To build and run container with this Dockerfile:
# docker build -t thepmftool-api -f ./.Dockerfile .
# docker run -d --rm -p 3000:3000 --name thepmftool-api thepmftool-api
# Alternativly, use docker compose in root to run this service
#
# Why build the server before the image?
# For performance and image size reasons, code is built locally first before
# it's sent to the daemon to build the image. Code can be built here but there
# is performance overhead running on top of the image running on the daemon.
#
# Why is RUN used and why they are split up:
# Use RUN instruction to install packages required by executing commands on top
# of the current image to create a new layer by committing the results. The RUN
# commands are all split up as different ephemeral intermmediate images to
# optimize the build process for caching.

# Use alpine image to reduce image size
FROM node:18-alpine

# Set NODE_ENV to production so that any libraries that will be optimized with
# this will be done so automatically.
ENV NODE_ENV production

WORKDIR /server

# @todo Remove this and remove from .dockerignore
COPY ./serviceAccountKey.json ./serviceAccountKey.json

# Copy dependency files for "npm ci"
COPY ./package*.json ./

# Copy over prisma schema to generate client library on npm install
COPY ./prisma/schema.prisma ./prisma/schema.prisma

# 'clean install' dependencies after copying dependency file so that changes in
# source code in later docker layers will not invalidate this layer. This only
# installs dependencies and skip devDependencies as NODE_ENV is 'production'.
RUN npm ci

# Copy build output files
COPY ./dist/ ./dist/

# Copy generated .env file into server root
COPY ./dist/.env ./.env

# https://youtu.be/WLsFF4mtqXQ?t=684
# USER node

# Define exposed ports, acting only as documentation. Docker run STILL need to
# map the ports with -p option.
EXPOSE 3000

# ENTRYPOINT Command ensures this command runs when the container is spun up
# and cannot be overwritten with shell arguements like CMD.
# Use exec form instead of shell form to run it as the main process.
ENTRYPOINT ["npm", "run", "start"]
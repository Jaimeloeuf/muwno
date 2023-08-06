# Dirty dockerfile build, i.e. uses code from local system instead of pulling from github to build
# 
# The build context of this should be the monorepo root
# This is named `server.Dockerfile` so that `server.Dockerfile.dockerignore` is used when this
# is used to build the image. If this used the default `.Dockerfile` name, docker will try to find
# a dockerignore file in the monorepo root, since that is the build context location, which it
# will not find any, and cause everything to be sent to the docker daemon.
#
# To build and run the image from this Dockerfile, where x is the name of the worker node's JS file name
# docker build -t thepmftool-api -f ./server.Dockerfile .
# docker run -d --rm -p 3000:3000 --name thepmftool-api thepmftool-api
# Alternativly, use docker compose in root to run this service
#
# Why the server needs to be built first before the image is built:
#   - For performance and image size reasons, the code is built locally first before being sent to the daemon for building the image.
#   - Building can be done on the image but since it will be on top of the image running on the daemon it adds additional performance overhead.
#
# Why is RUN used and why they are split up:
#   - Use RUN instruction to install packages required by executing commands on top of the current image to create a new layer by committing the results.
#   - The RUN commands are all split them up as different ephemeral intermmediate images to optimize the build process for caching

# Use alpine image to reduce image size
FROM node:18-alpine

# Set NODE_ENV to production so that any libraries that will be optimized with this will be done so automatically.
ENV NODE_ENV production

# Copy both package.json and package-lock.json in for installing dependencies with "npm ci"
COPY ./server/package*.json ./server/

# @todo Maybe just need the schema...
# Copy over prisma code to generate the client library on npm install
COPY ./server/prisma/ ./server/prisma/

# Copy over domain-model library in monorepo for npm install to find it
COPY ./domain/ ./domain/

# Move to /server before running installation
WORKDIR /server

# @todo Use a more efficient installation like npm ci
# Install Node JS dependencies right after dependency file copied in so that changes in the source
# code in the later docker layers at "COPY ./server/dist/ ./server/dist/" does not invalidate this layer.
RUN npm install

# Reset workdir back to monorepo root to copy source files over
WORKDIR /

# Copy build output files
COPY ./server/dist/ ./server/dist/

# Copy generated .env file into server root
COPY ./server/dist/.env ./server/.env

# https://youtu.be/WLsFF4mtqXQ?t=684
# USER node

# Reset workdir back to /server so that the 'entrypoint' command works as that requires current path to be in /server
WORKDIR /server

# Define exposed ports, acting only as documentation. You STILL need to map the ports with -p option with docker run
EXPOSE 3000

# ENTRYPOINT Command ensures this command runs when the container is spun up, and cannot be overwritten with shell arguements like CMD
# Using exec form instead of shell form
ENTRYPOINT ["npm", "run", "start"]
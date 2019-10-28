# Peaksware Workout App
Workout SPA for Peaksware take-home coding test.

## Running the Code

1. Open a new terminal window and `cd` to desired installation directory.
2. `git clone` the repository.
3. `cd PeakswareWorkoutApp/`
4. `npm i` to install npm dependencies.
5. `npm run build` to build React src/ code into a new dist/ folder.
6. `npm start` to start the node.js backend server.
7. Visit [localhost:3000](http://localhost:3000/) to view the running code.

To stop the server:

1. `Ctrl-C` in the running terminal.

## NPM Commands

After running `npm i` to install project dependencies, a number of run scripts become available.

* `npm run dev`: Builds React src/ code into the dist/ folder and starts the backend node.js server.
* `npm start`: Starts the backend node.js server.
* `npm run build`: Builds React src/ code into the dist/ folder.
* `npm run test`: Runs the [jest](https://github.com/facebook/jest) unit tests.

## TODO

* Best effort function in workout service doesn't properly handle unevenly timed events
* Zooming into data on the power output graph doesn't recalculate the map and best effort data
* Optimize Webpack build process
 * Code splitting
 * Server-side rendering
* Unit test the API
* Better error handling
* Convert JavaScript code to TypeScript
* Move application into MVC design pattern as it grows (if appropriate)
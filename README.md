# grpc-client

## Issue

1. if u having Cannot find module 'typescript' error. https://github.com/toonvanstrijp/nestjs-i18n/issues/551

### Getting Started

The grpc-client API endpoints.

### How to setup environment?

1. Clone this repository.

2. Change directory to the repository.

3. Install package dependencies.
   ```
   npm install
   ```

### How to run unit-test?

1. Write test cases in a `*.test.ts` file under the same folder with the actual module file. For example, module file `src/app-service.ts`, unit-test file `src/app-service.test.ts`.

2. Run unit-test command.

   - To run single module unit-test.

     ```
     npm run test-this src/app-service.test.ts
     ```

   - To run all unit-test.
     ```
     npm run test
     ```

### How to debug?

Please use unit-test method for debugging.

1. Set breakpoint on the source code by pressing `F9` key.

2. Run unit-test command with debugging.

   ```
   npm run debug-this src/app-service.test.ts
   ```

3. Start debugging by pressing `F5` key.

### How to release version?

Git pipeline will perform unit-test, build container image and push to the container registry.

- Bump a `prerelease` version (E.g. `1.0.0-rc.0`).

  - Write commit message that contain `run-prerelease` keyword to `feature` branch.

- Bump a `release` version (E.g. `1.0.0`).

  - Merge into `default` branch (main/master) with any commit message.

> Note: **Code review** process should be perform before merge into `default` branch or release version.

### Merge into default branch without trigger pipeline

If you want to merge into `default` branch without triggering the pipeline, write commit message that contain `run-without-release`.

chatbot: 0

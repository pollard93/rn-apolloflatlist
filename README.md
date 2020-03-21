# Made by Prism Components React npm Boilerplate

Boilerplate code for publishing a React Native NPM package.

Includes support for typescript and unit tests.

## Usage

1. Install modules - `yarn && cd example && yarn`

2. Bundle with - `yarn build`

3. Setup example - `yarn setup:example`

4. Start development with storybook - `yarn start:ios:example` or `yarn start:android:example`

5. Run unit tests - `yarn test:unit`

6. Run lint tests - `yarn test:lint`

7. Run package script tests - `yarn test:package`

8. Install via git `yarn add ssh://bitbucket.org:madebyprism/mpb-components-rn-npm-boilerplate.git#{{branch/tag}}`

## Using as a boilerplate

1. Update package.json name, description and version

2. Run `yarn setup:example` after any name or version change. This will build and install the node module in the example.

3. Add a new git repo and push

4. Any non development dependencies must be added to the devDependencies and also the peerDependencies.

5. Tag versions in git so they be selected on installation
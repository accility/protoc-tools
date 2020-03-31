# @accility/protoc-tools

protoc-tools is a wrapper package for Google's protobuf compiler [protoc](https://github.com/protocolbuffers/protobuf/releases) executable. The package manages installing and calling protoc both from the command line and programmatically from node.

## Installing

```bash
npm install -g @accility/protoc-tools
protoc --version
```

Alternatively

```bash
npm install -D @accility/protoc-tools
npx protoc
```

## Usage

Calling protoc programmatically

```javascript
const protoc = require('@accility/protoc-tools');
const path = require('path');

protoc({
    includeDirs: [
        path.resolve('/Google/api-common-protos'),
        path.resolve('.')
    ],
    files: ['product.proto'],
    outOptions: 'logtostderr=true:.'
});

```

The directory include/google/protobuf includes all core .proto-files, and is automatically added to the include directories.
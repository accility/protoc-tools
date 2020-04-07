# Protocol Buffer Tools

:warning: This package is still in early days and the interfaces might change back and forth. When stable enough it will be released as v1.0.

protoc-tools is a wrapper package for Google's .proto compiler [protoc](https://github.com/protocolbuffers/protobuf/releases) executable. The package manages installing and calling protoc both from the command line and programmatically from node.

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
const tools = require('@accility/protoc-tools');
const path = require('path');

tools.protoc({
    includeDirs: [
        path.resolve('./test/protos')
    ],
    files: ['simple.proto'],
    outDir: path.resolve(__dirname, 'generated'),
    outOptions: [
        tools.generators.cpp({ outPath: path.resolve(__dirname, 'generated') }),
        tools.generators.csharp({ outOptions: 'file_extension=.g.cs' }),
        tools.generators.java(),
        tools.generators.js(),
        tools.generators.objc(),
        tools.generators.python(),
        tools.generators.ruby()
    ]
});
```

The directory include/google/protobuf includes all core .proto-files, and is
automatically added to the include directories.

## Code Generators

By default protoc can output C++, C#, Java, Javascript, Objective-C, Python and
Ruby serialization code.

See [Generator Options](https://developers.google.com/protocol-buffers/docs/reference/overview)
for information about available options for each of the built-in generators.

With the help of plugins we can generate code for
additional situations. See also:

[@accility/protoc-swagger-plugin](https://www.npmjs.com/package/@accility/protoc-swagger-plugin)


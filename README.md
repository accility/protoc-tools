# Protocol Buffer Tools

:warning: This package is still in early days and the interfaces might change back and forth. When stable enough it will be released as v1.0.

protoc-tools is a wrapper package for Google's .proto compiler [protoc](https://github.com/protocolbuffers/protobuf/releases) executable. The package manages installing and calling protoc both from the command line and programmatically from node.

## What problems do we solve?
* No need to pre-install the `protoc` executable file globally on your machine.
* On a build server, the correct architecture for the executable is automatically used.
* Simplify calling `protoc`. You do not need to know the location of the exectuable or the core proto-files. You only need to reference your own protobuffer files.
* Better conformance to the "npm-way" of doing things.

## Installing

```bash
npm install -D @accility/protoc-tools
```

Alternatively Install globally
```bash
npm install -g @accility/protoc-tools
```

## Usage

### Calling protoc on the command line

(Assuming you are located where the node_modules package can be reached.)
```bash
protoc --version
```

### Calling protoc programmatically

```javascript
const tools = require('@accility/protoc-tools');
const path = require('path');

// Generate client code for all supported languages
tools.protoc({
    includeDirs: [
        path.resolve('./test/protos')
    ],
    files: ['simple.proto'],
    outDir: path.resolve(__dirname, 'generated'),
    outOptions: [
        tools.generators.cpp({ outPath: path.resolve(__dirname, 'generated/cpp') }), // Override output folder for the C++ files
        tools.generators.csharp({ outOptions: 'file_extension=.g.cs' }), // Use generator specific options
        tools.generators.java(),
        tools.generators.js(),
        tools.generators.kotlin(),
        tools.generators.objc(),
        tools.generators.php(),
        tools.generators.python(),
        tools.generators.ruby()
    ]
});
```
> :information_source: The directory include/google/protobuf includes all core .proto-files, and is
automatically added to the include directories.

For more API examples, see the [test suite](test/tests.ts).

## Code Generators

`protoc` can output C++, C#, Java, Javascript, Kotlin, Objective-C, PHP, Python and
Ruby serialization code by default.

> :information_source:
See [Generator Options](https://developers.google.com/protocol-buffers/docs/reference/overview)
for information about available options for each of the built-in generators.

With the help of plugins we can generate code for
additional situations. See also:

[@accility/protoc-swagger-plugin](https://www.npmjs.com/package/@accility/protoc-swagger-plugin)


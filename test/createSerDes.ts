import * as tools from '../dist/lib/protoc';
import { resolve } from 'path';

tools.protoc({
    includeDirs: [
        resolve('./test/protos')
    ],
    files: ['simple.proto'],
    outDir: resolve(__dirname, 'generated'),
    outOptions: [
        tools.generators.cpp({outPath: resolve(__dirname, 'generated')}),   // '--cpp_out=logtostderr=true:./generated',
        tools.generators.csharp({outOptions: 'file_extension=.g.cs'}),      // '--csharp_out=file_extension=.g.cs:./generated'
        tools.generators.java(),
        tools.generators.js(),
        tools.generators.objc(),
        tools.generators.python(),
        tools.generators.ruby()
    ]
});

const tools = require('../dist/lib/protoc');
const path = require('path');

tools.protoc({
    includeDirs: [
        path.resolve('./test/protos')
    ],
    files: ['simple.proto'],
    outOptions: path.resolve(__dirname, 'generated') // TODO: Make sure to specify what type of output we want.
});

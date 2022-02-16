import * as tools from '../dist/lib/protoc'
import { join, resolve } from 'path'
import { normalize } from 'path/posix'

/**
 * Equivalent to running the command
 * protoc -Inative/include -Itest/protos --cpp_out=:test/generated/single simple.proto
 */
tools.protoc({
	includeDirs: [
		resolve('./test/protos')
	],
	files: ['simple.proto'],
	outDir: resolve(__dirname, 'generated', 'single'),
	outOptions: [
		tools.generators.cpp()
	]
})

/**
 * Emit client code for multiple languages at once.
 */
tools.protoc({
	includeDirs: [
		resolve('./test/protos')
	],
	files: ['simple.proto'],
	outDir: resolve(__dirname, 'generated', 'multi'),
	outOptions: [
		tools.generators.cpp({ outPath: resolve(__dirname, 'generated/cpp') }), // Override output folder for the C++ files
		tools.generators.csharp({ outOptions: 'file_extension=.g.cs' }), // Use generator specific options
		tools.generators.java(),
		tools.generators.js(),
		tools.generators.kotlin(),
		tools.generators.objc(),
		tools.generators.php(),
		tools.generators.python(),
		tools.generators.ruby()
	]
})

/**
 * Don't auto-include Google's core proto files
 */
 tools.protoc({
	includeDirs: [
		resolve('./test/protos')
	],
	files: ['simple.proto'],
	outDir: resolve(__dirname, 'generated', 'nocore'),
	outOptions: [
		tools.generators.js(),
	],
	noDefaultIncludes: true
})

/**
 * Print debug output. Let's you see the actual protoc-command being executed.
 */
 tools.protoc({
	includeDirs: [
		resolve('./test/protos')
	],
	files: ['simple.proto'],
	outOptions: [
		tools.generators.js({outPath: join(__dirname, 'generated', 'verbose')}),
	],
	verbose: true
})

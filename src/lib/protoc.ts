import { resolve } from 'path'
import { spawn } from 'child_process'

export interface GeneratorOptions {
	pluginPath?: string
	outPath?: string
	outOptions?: string
}

export interface OutputOptions extends GeneratorOptions {
	name: string
}

export interface ProtocOptions {
	includeDirs: string[]      // Paths to input files and dependencies
	files: string[]            // Input .proto-files
	outDir?: string          // Default directory for the generated files
	outOptions?: OutputOptions[]
}

export function createGeneratorOptions(name: string) {
	return function ({ pluginPath = undefined, outPath = undefined, outOptions = undefined }: GeneratorOptions = {}): OutputOptions { return { name, pluginPath, outPath, outOptions } }
}

export const generators = {
	cpp: createGeneratorOptions('cpp'),
	csharp: createGeneratorOptions('csharp'),
	java: createGeneratorOptions('java'),
	js: createGeneratorOptions('js'),
	objc: createGeneratorOptions('objc'),
	python: createGeneratorOptions('python'),
	ruby: createGeneratorOptions('ruby')
}

// Convert the protoc options object to the corresponding command line arguments
export function protoc(options: ProtocOptions): Promise<void> {
	const defaultProtoDir = resolve(__dirname, '../../native/include')
	const protoDirs = [defaultProtoDir, ...options.includeDirs].map(e => `-I${e}`)
	const pluginArgs = (options.outOptions ?? []).filter(o => o.pluginPath).map(o => `--plugin=protoc-gen-${o.name}=${o.pluginPath}`)
	const outArgs = (options.outOptions ?? []).map(o => `--${o.name}_out=${o.outOptions ?? ''}:${o.outPath ?? options.outDir ?? '.'}`)

	const args = [
		resolve(__dirname, '../bin/protoc-cli.js'),
		...protoDirs,
		...pluginArgs,
		...outArgs,
		...options.files
	]

	var processChild = spawn('node', args, { stdio: 'inherit' })
	return new Promise((resolve, reject) => {
		processChild.on("close", (code, signal) => code == 0 ? resolve() : reject([code, signal]))
	})
}
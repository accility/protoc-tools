import { resolve } from 'path'
import { spawn } from 'child_process'
import * as fs from 'fs'

export interface GeneratorOptions {
	pluginPath?: string
	outPath?: string
	outOptions?: string
}

export interface OutputOptions extends GeneratorOptions {
	name: string
}

export interface ProtocOptions {
	/** Paths to input files and dependencies. */
	includeDirs: string[]
	files: string[]
	outDir?: string
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

async function mkDirRecursive(dir: string) {
	try {
		await fs.promises.stat(dir)
	} catch (err) {
		if (err.code === 'ENOENT') {
			await fs.promises.mkdir(dir, { recursive: true })
		} else {
			throw err
		}
	}
}

// Convert the protoc options object to the corresponding command line arguments
export async function protoc(options: ProtocOptions): Promise<void> {
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

	if (options.outDir)
		await mkDirRecursive(options.outDir)

	for (const option of options.outOptions ?? []) {
		if (option.outPath)
			await mkDirRecursive(option.outPath)
	}

	const processChild = spawn('node', args, { stdio: 'inherit' })
	return await new Promise((resolve, reject) => {
		processChild.on("close", (code, signal) => code == 0 ? resolve() : reject([code, signal]))
	})
}
import { join, relative } from 'path'
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
	outOptions?: OutputOptions[],
	/** Do not automatically include the path to Google's core proto files. */
	noDefaultIncludes?: boolean,
	/** Verbose console output. Lets you see the protoc-command being called. */
	verbose?: boolean
}

export function createGeneratorOptions(name: string) {
	return function ({ pluginPath = undefined, outPath = undefined, outOptions = undefined }: GeneratorOptions = {}): OutputOptions { return { name, pluginPath, outPath, outOptions } }
}

export const generators = {
	cpp: createGeneratorOptions('cpp'),
	csharp: createGeneratorOptions('csharp'),
	java: createGeneratorOptions('java'),
	js: createGeneratorOptions('js'),
	kotlin: createGeneratorOptions('kotlin'),
	objc: createGeneratorOptions('objc'),
	php: createGeneratorOptions('php'),
	python: createGeneratorOptions('python'),
	ruby: createGeneratorOptions('ruby')
}

function isError(error: unknown): error is NodeJS.ErrnoException {
	return error instanceof Error && "code" in error;
}

async function mkDirRecursive(dir: string) {
	try {
		await fs.promises.stat(dir)
	} catch (err) {
		if (isError(err) && err.code === 'ENOENT') {
			await fs.promises.mkdir(dir, { recursive: true })
		} else {
			throw err
		}
	}
}

// Convert the protoc options object to the corresponding command line arguments
export async function protoc(options: ProtocOptions): Promise<void> {
	const defaultProtoDir = relative('.', join(__dirname, '..', '..', 'native', 'include'))
	const includeDirs = options.noDefaultIncludes ?
		options.includeDirs :
		[defaultProtoDir, ...options.includeDirs]
	const protoDirs = includeDirs.map(e => `-I${relative('.', e)}`)
	const pluginArgs = (options.outOptions ?? []).filter(o => o.pluginPath).map(o => `--plugin=protoc-gen-${o.name}=${o.pluginPath}`)
	const outArgs = (options.outOptions ?? []).map(o => `--${o.name}_out=${o.outOptions ?? ''}:${o.outPath ?? options.outDir ?? '.'}`)

	const args = [
		relative('.', join(__dirname, '..', 'bin', 'protoc-cli.js')),
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
	
	if (options.verbose)
		console.log(`Calling 'protoc ${args.join(' ')}'`);

	const processChild = spawn('node', args, { stdio: 'inherit' })
	return await new Promise((resolve, reject) => {
		processChild.on("close", (code, signal) => code == 0 ? resolve() : reject([code, signal]))
	})
}
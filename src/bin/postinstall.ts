import { https } from 'follow-redirects'
import { Extract } from 'unzipper'
import { resolve } from 'path'
import * as fs from 'fs'

const version = '3.20.0'
function platform() {
	switch (process.platform) {
		case 'linux': return 'linux-x86_'
		case 'darwin': return 'osx-x86_'
		case 'win32': return 'win'
		default: throw new Error(`Unsupported protoc platform '${process.platform}'`)
	}
}

function arch() {
	switch (process.arch) {
		case 'x64': return '64'
		case 'x32': return '32'
		case 'ia32': return '32'
		default: throw new Error(`Unsupported protoc CPU architecture '${process.arch}'`)
	}
}

const url = `https://github.com/protocolbuffers/protobuf/releases/download/v${version}/protoc-${version}-${platform()}${arch()}.zip`
const destinationFolder = 'native'

const extension = process.platform == 'win32' ? '.exe' : ''
const protoc_path = resolve(__dirname, '../../native/bin/protoc' + extension)

console.log(url)
https.get(url, response => {
	response.pipe(Extract({ path: destinationFolder }))
		.on('close', () => fs.chmodSync(protoc_path, '0775'))
})


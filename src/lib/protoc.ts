import * as path from 'path';
import { spawn } from 'child_process';

export interface PluginOptions {
    name: string;
    path: string;
    outOptions: string;
}

export interface ProtocOptions {
    includeDirs: string[];
    files: string[];
    outOptions: string;
    plugin: PluginOptions;
}

// Convert the protoc options object to the corresponding command line arguments
export function protoc(options: ProtocOptions) {
  const defaultProtoDir = path.resolve(__dirname, '../../native/include');
  const protoDirs = [defaultProtoDir, ...options.includeDirs].map(e => `-I${e}`);
  const pluginArg = `--plugin=protoc-gen-${options.plugin.name}=${options.plugin.path}`;
  const outOptions = `--${options.plugin.name}_out=${options.plugin.outOptions}`;

  const args = [
    pluginArg,
    outOptions,
    ...protoDirs,
    ...options.files
  ];

  spawn('node', [path.resolve(__dirname, '../bin/protoc-cli.js'), ...args], {stdio: 'inherit'});
};
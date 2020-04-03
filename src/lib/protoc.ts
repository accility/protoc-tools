import * as path from 'path';
import { spawn } from 'child_process';

export interface PluginOptions {
  name: string;
  path: string;
}

export interface ProtocOptions {
  includeDirs: string[];
  files: string[];
  outOptions?: string;
  plugin?: PluginOptions;
}

// Convert the protoc options object to the corresponding command line arguments
export function protoc(options: ProtocOptions) {
  const defaultProtoDir = path.resolve(__dirname, '../../native/include');
  const protoDirs = [defaultProtoDir, ...options.includeDirs].map(e => `-I${e}`);

  const args = [
    path.resolve(__dirname, '../bin/protoc-cli.js'),
    ...protoDirs,
    ...options.files
  ];

  const plugin = options.plugin;
  if (plugin) {
    args.push(`--plugin=protoc-gen-${plugin.name}=${plugin.path}`);
    args.push(`--${plugin.name}_out=${options.outOptions ?? '.'}`);
  }

  spawn('node', args, { stdio: 'inherit' });
};
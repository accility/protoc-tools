#!/usr/bin/env node
// This is a simple wrapper to the command line 'protoc'.
// It simply forwards the arguments to the proper protoc-executable
import { resolve } from 'path';
import { spawnSync } from 'child_process';

const extension = process.platform == 'win32' ? '.exe' : '';
const protoc_path = resolve(__dirname, '../../native/bin/protoc' + extension);

const args = process.argv.slice(2);
spawnSync(protoc_path, args, {stdio: 'inherit'});

#!/usr/bin/env node
// This is a simple wrapper to the command line 'protoc'.
// It simply forwards the arguments to the proper protoc-executable
import * as path from 'path';
import { spawn } from 'child_process';

const extension = process.platform == 'win32' ? '.exe' : '';
const protoc_path = path.resolve(__dirname, '../../native/bin', process.platform, process.arch, 'protoc' + extension);

const args = process.argv.slice(2);
spawn(protoc_path, args, {stdio: 'inherit'});

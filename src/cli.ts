#!/usr/bin/env node

const { Command } = require('commander');
import { translate } from './main';

const program = new Command();

program
  .version('0.0.1')
  .name('fanyi')
  .usage('<English>')
  .arguments('<English>')
  .action((word: string) => {
    translate(word);
  });

program.parse(process.argv);

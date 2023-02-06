import { GhActionInputs } from './types';
import { readdirSync, readFileSync, rmSync } from 'fs';
import {join} from 'path';
import * as core from '@actions/core';
import { readJsonFileSync } from './utils';

export function processResult(ghActionInputs: GhActionInputs): { resultPath: string, resultSummary: string } {
  const rcFileObj = readJsonFileSync(ghActionInputs.rcPath);
  const allResults = readdirSync(rcFileObj.persist.outPath);
  core.debug(`Output folder content: ${allResults.join(', ')}`);
  if(!allResults.length) {
    throw new Error(`No results present in folder ${rcFileObj.persist.outPath}`);
  }

  const resultPath = join(rcFileObj.persist.outPath, allResults.filter(v => v.endsWith('.md'))[0]);

  core.debug(`Process results form: ${resultPath}`);
  let resultSummary: string;
  try {
    resultSummary = readFileSync(resultPath).toString();
    rmSync(resultPath);
  } catch (e) {
    throw e;
  }

  core.debug(`Results: ${resultSummary}`);
  return { resultPath, resultSummary };
}

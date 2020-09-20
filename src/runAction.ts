import { EventPayloads } from '@octokit/webhooks';
import { exec } from '@actions/exec';
import stringArgv from 'string-argv';
import { Inputs } from '.';
import { Octokit } from '@octokit/rest';

export async function runAction(
  payload: EventPayloads.WebhookPayloadIssueComment,
  inputs: Inputs
) {
  if (payload.comment.body !== inputs.comment.trim()) {
    console.log('Aborting. Not relevant comment');
    return;
  }

  const repoOwner = payload.repository.owner.login;
  const repoName = payload.repository.name;
  const octokit = new Octokit();
  const pullRequest = await octokit.pulls.get({
    owner: repoOwner,
    repo: repoName,
    pull_number: payload.issue.number,
  });

  const branchName = pullRequest.data.head.ref;

  console.log(`Received comment: "${inputs.comment}"`);
  const [cmd, ...cmdArgs] = stringArgv(inputs.command);
  console.log('Command: ', { cmd, cmdArgs });

  await exec('git', [
    'clone',
    '--depth',
    '1',
    '--single-branch',
    '--branch',
    branchName,
    `https://x-access-token:${inputs.accessToken}@github.com/${repoOwner}/${repoName}.git`,
  ]);

  await exec('cd', [repoName]);

  await exec('git', ['config', 'user.name', 'github-actions']);
  await exec('git', ['config', 'user.email', 'github-actions@github.com']);

  await exec(cmd, cmdArgs);
  await exec('git', ['add', '-u']);
  await exec('git', ['commit', '-m', `Result of "${inputs.command}"`]);
  await exec('git', ['push', 'origin', branchName]);
}

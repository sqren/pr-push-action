# pr-push-action

Run a command on a PR that causes to update. The change is then committed.

Workflow

```yml
name: Pull Request Comment Action
on:
  issue_comment:
    types: [created]

jobs:
  bump:
    name: Pull Request Comment
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
          token: ${{ secrets.GITHUB_TOKEN }}
      - uses: sqren/pr-push-action@v1
        with:
          comment: 'please bump'
          command: yarn bump
```

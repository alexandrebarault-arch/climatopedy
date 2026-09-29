# Instructions for agents working in CLIMATOPEDY

## GitHub Actions

- Do not create or recreate GitHub Actions workflows or jobs for this project, including files under `.github/workflows/`.
- Do not add steps to, re-enable, or otherwise expand GitHub Actions automation as part of another task.
- Run the relevant checks locally instead (`npm.cmd test`, `npm.cmd run harness:fast`, `npm.cmd run harness:full`, and the relevant build or lint command).
- GitHub is used only as the remote repository receiving local commits; a push must not trigger or depend on a verification workflow.
- Only change this rule if the user explicitly asks for a GitHub Actions workflow or job.

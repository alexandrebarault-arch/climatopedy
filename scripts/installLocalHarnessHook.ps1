$ErrorActionPreference = 'Stop'
$repoRoot = git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0) { throw 'Not inside a Git worktree.' }
git -C $repoRoot config --worktree core.hooksPath .githooks
if ($LASTEXITCODE -ne 0) { throw 'Unable to configure the local hooks path.' }
Write-Host "Local numerical pre-commit hook enabled for $repoRoot"
Write-Host 'This changes only the current worktree Git config; it does not push or invoke GitHub Actions.'

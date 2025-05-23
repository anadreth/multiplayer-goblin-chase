# Pull Request Review Workflow

This document outlines the process for reviewing pull requests using the automated workflow tools.

## Overview

The PR review workflow allows you to:

1. Fetch all comments from GitHub pull requests
2. Generate a structured summary of the PR
3. Analyze comments and make necessary code changes

## Prerequisites

- GitHub CLI (`gh`) installed and authenticated
- PowerShell (included with Windows)

## How to Use

### 1. Trigger a PR Review

Run the review script with the PR number:

```bash
# Using the PowerShell script directly
./scripts/review-pr.ps1 <PR_NUMBER>

# Or using the batch wrapper
scripts\review-pr.cmd <PR_NUMBER>
```

For example:

```bash
scripts\review-pr.cmd 3
```

### 2. Review the Generated Summary

The script creates three files in the `pr-reviews` directory:

- `pr-<NUMBER>-details.json`: Raw PR metadata
- `pr-<NUMBER>-comments.json`: Raw comments from GitHub
- `pr-<NUMBER>-summary.md`: A structured, human-readable summary

### 3. Address Comments with Cascade

Ask Cascade to help address the PR comments by saying:

```
Please review this PR summary and help me address the comments in PR-<NUMBER>
```

Cascade will:

1. Analyze the PR comments
2. Suggest code changes to address feedback
3. Help implement the changes

## Workflow Steps

1. **Fetch**: Get all PR data from GitHub
2. **Organize**: Structure comments by file and line number
3. **Summarize**: Create a readable summary document
4. **Analyze**: Review comments for patterns and issues
5. **Implement**: Make necessary code changes

## Troubleshooting

- If you encounter PowerShell execution policy errors, run PowerShell as administrator and execute:
  ```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

- If GitHub CLI authentication fails, run `gh auth login` to authenticate

## Example Conversation

You: "Please review PR 3"

Cascade will:
1. Use the workflow to extract PR details
2. Analyze the comments and code
3. Suggest and implement improvements

## Maintenance

This workflow can be extended with additional scripts for:

- Automated fixes for common issues
- PR statistics and metrics
- Integration with CI/CD pipelines

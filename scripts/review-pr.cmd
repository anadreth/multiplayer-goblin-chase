@echo off
REM Pull Request Review Helper Wrapper Script
REM Usage: scripts\review-pr.cmd <PR_NUMBER>

if "%1"=="" (
  echo Error: PR number is required.
  echo Usage: scripts\review-pr.cmd PR_NUMBER
  exit /b 1
)

echo Running PowerShell PR review script for PR #%1...
powershell -ExecutionPolicy Bypass -File "%~dp0review-pr.ps1" %1

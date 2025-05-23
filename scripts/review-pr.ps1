# Pull Request Review Helper Script
# Usage: ./scripts/review-pr.ps1 <PR_NUMBER>

param (
    [Parameter(Mandatory=$true)]
    [int]$PrNumber
)

# Get repository information
$repoInfo = gh repo view --json nameWithOwner | ConvertFrom-Json
$repoFullName = $repoInfo.nameWithOwner

Write-Host "\nAnalyzing PR #$PrNumber in $repoFullName...\n" -ForegroundColor Cyan

# Create output directory if it doesn't exist
$outputDir = "./pr-reviews"
if (!(Test-Path -Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Output files
$prDetailsFile = "$outputDir/pr-${PrNumber}-details.json"
$prCommentsFile = "$outputDir/pr-${PrNumber}-comments.json"
$prSummaryFile = "$outputDir/pr-${PrNumber}-summary.md"

# Get PR details
Write-Host "Fetching PR details..." -ForegroundColor Yellow
gh pr view $PrNumber --json title,body,author,createdAt,updatedAt,state,files | Out-File -FilePath $prDetailsFile

# Get PR comments
Write-Host "Fetching PR comments..." -ForegroundColor Yellow
gh api "/repos/$repoFullName/pulls/$PrNumber/comments" -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" | Out-File -FilePath $prCommentsFile

# Generate summary markdown
Write-Host "Generating PR summary..." -ForegroundColor Yellow

$prDetails = Get-Content -Path $prDetailsFile -Raw | ConvertFrom-Json
$prComments = Get-Content -Path $prCommentsFile -Raw | ConvertFrom-Json

$summary = "# PR #$PrNumber Review Summary\n\n"
$summary += "**Title:** $($prDetails.title)\n\n"
$summary += "**Author:** $($prDetails.author.login)\n\n"
$summary += "**Created:** $($prDetails.createdAt)\n\n"
$summary += "**Updated:** $($prDetails.updatedAt)\n\n"
$summary += "**State:** $($prDetails.state)\n\n"

$summary += "## Files Changed\n\n"
foreach ($file in $prDetails.files) {
    $summary += "- $($file.path) (Additions: $($file.additions), Deletions: $($file.deletions))\n"
}

$summary += "\n## Review Comments\n\n"

$fileComments = @{}

foreach ($comment in $prComments) {
    if (!$fileComments.ContainsKey($comment.path)) {
        $fileComments[$comment.path] = @()
    }
    
    $fileComments[$comment.path] += @{
        line = $comment.line
        body = $comment.body
    }
}

foreach ($file in $fileComments.Keys | Sort-Object) { 
    $summary += "### $file\n\n"
    
    foreach ($comment in $fileComments[$file] | Sort-Object -Property line) {
        $summary += "- Line $($comment.line): $($comment.body)\n"
    }
    
    $summary += "\n"
}

$summary | Out-File -FilePath $prSummaryFile

Write-Host "\nPR review summary created at: $prSummaryFile" -ForegroundColor Green
Write-Host "\nRaw PR details saved to: $prDetailsFile" -ForegroundColor Gray
Write-Host "Raw PR comments saved to: $prCommentsFile\n" -ForegroundColor Gray

Write-Host "Instructions:\n" -ForegroundColor Cyan
Write-Host "1. Review the summary at $prSummaryFile"
Write-Host "2. For detailed analysis, provide the summary to Cascade with the command:"
Write-Host "   'Please review this PR summary and help me address the comments'\n"

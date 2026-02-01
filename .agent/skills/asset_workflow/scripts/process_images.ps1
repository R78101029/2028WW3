param (
    [string]$Novel
)

$ErrorActionPreference = "Stop"
$ProjectsRoot = "projects"

# Helper: Get available projects
function Get-ProjectList {
    if (Test-Path $ProjectsRoot) {
        return Get-ChildItem -Path $ProjectsRoot -Directory | Select-Object -ExpandProperty Name
    }
    return @()
}

# 1. Determine Project
if ([string]::IsNullOrWhiteSpace($Novel)) {
    $projects = Get-ProjectList
    
    if ($projects.Count -eq 0) {
        Write-Host "Error: No projects found in '$ProjectsRoot/'." -ForegroundColor Red
        exit 1
    }
    elseif ($projects.Count -eq 1) {
        $Novel = $projects[0]
        Write-Host "Auto-detected project: $Novel" -ForegroundColor Cyan
    }
    else {
        Write-Host "Available projects:" -ForegroundColor Cyan
        for ($i = 0; $i -lt $projects.Count; $i++) {
            Write-Host " [$($i+1)] $($projects[$i])"
        }
        
        # Interactive prompt if running locally? For agent, we prefer defaulting or erroring if vague.
        # But script is for user too.
        $selection = Read-Host "Select project number (default 1)"
        if ([string]::IsNullOrWhiteSpace($selection)) { $selection = "1" }
        
        try {
            $idx = [int]$selection - 1
            if ($idx -ge 0 -and $idx -lt $projects.Count) {
                $Novel = $projects[$idx]
            }
            else {
                throw "Invalid selection"
            }
        }
        catch {
            Write-Host "Invalid selection. Defaulting to first project." -ForegroundColor Yellow
            $Novel = $projects[0]
        }
    }
}

Write-Host "=== Starting Asset Workflow for [$Novel] ===" -ForegroundColor Cyan

# 2. Validation
$ChapterDir = Join-Path $ProjectsRoot $Novel "chapters"
$AssetDir = Join-Path $ProjectsRoot $Novel "_assets"

if (-not (Test-Path $ChapterDir)) {
    Write-Host "Error: Chapter directory not found: $ChapterDir" -ForegroundColor Red
    exit 1
}

# 3. Execution
Write-Host "`n[Step 1] Auto-Inserting Images..." -ForegroundColor Yellow
node scripts/auto-insert-images.js "$Novel"

Write-Host "`n[Step 2] Syncing Chapters..." -ForegroundColor Yellow
node scripts/sync-chapters.js "$Novel"

Write-Host "`n=== Completed [$Novel] ===" -ForegroundColor Green
Write-Host "Check changes in: projects/$Novel/chapters/" -ForegroundColor Gray

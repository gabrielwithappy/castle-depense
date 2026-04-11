$ErrorActionPreference = "Stop"

$workspaceRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$tmpDir = Join-Path $workspaceRoot ".codex\.tmp"
$logFile = Join-Path $tmpDir "browsermcp-wrapper.log"
$port = 9009

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

function Write-Log {
    param([string]$Message)
    Add-Content -Path $logFile -Value "$(Get-Date -Format o) $Message"
}

Write-Log "wrapper start"

try {
    $processIds = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue |
        Select-Object -ExpandProperty OwningProcess -Unique

    Write-Log "found owning processes: $($processIds -join ',')"

    foreach ($processId in $processIds) {
        if ($processId) {
            Write-Log "stopping process $processId"
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        }
    }
} catch {
    Write-Log "clear port failed: $($_.Exception.Message)"
}

$localEntry = Join-Path $workspaceRoot "node_modules\@browsermcp\mcp\dist\index.js"
$globalEntry = Join-Path $env:APPDATA "npm\node_modules\@browsermcp\mcp\dist\index.js"

if (Test-Path $localEntry) {
    $entry = $localEntry
} elseif (Test-Path $globalEntry) {
    $entry = $globalEntry
} else {
    throw "Unable to find @browsermcp/mcp entry point. Checked: $localEntry, $globalEntry"
}

$nodeCommand = Get-Command node -ErrorAction Stop

Write-Log "launching node entry: $entry"
& $nodeCommand.Source $entry

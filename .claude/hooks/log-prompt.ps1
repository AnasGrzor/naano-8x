# Captures UserPromptSubmit event -> appends PROMPT entry to .agent-logs session file.
$ErrorActionPreference = "Stop"
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$input_json = [Console]::In.ReadToEnd()
$data = $input_json | ConvertFrom-Json

$sessionId = $data.session_id
$prompt = $data.prompt
$cwd = $data.cwd
if (-not $cwd) { $cwd = (Get-Location).Path }

$repoRoot = $cwd
$logsDir = Join-Path $repoRoot ".agent-logs"
if (-not (Test-Path $logsDir)) { New-Item -ItemType Directory -Force -Path $logsDir | Out-Null }

$stateDir = Join-Path $repoRoot ".claude\hooks\.state"
if (-not (Test-Path $stateDir)) { New-Item -ItemType Directory -Force -Path $stateDir | Out-Null }

$sessionStateFile = Join-Path $stateDir "$sessionId.json"

$now = [DateTime]::UtcNow
$nowIso = $now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

if (Test-Path $sessionStateFile) {
    $state = Get-Content $sessionStateFile -Raw | ConvertFrom-Json
    $state.total_exchanges = [int]$state.total_exchanges + 1
    $state.last_prompt_time = $nowIso
} else {
    $startTime = $now
    $fileStamp = $now.ToString("yyyy-MM-dd_HH-mm-ss")
    $logFileName = "${fileStamp}_${sessionId}.md"
    $state = [PSCustomObject]@{
        session_id = $sessionId
        date = $now.ToString("yyyy-MM-dd")
        log_file = $logFileName
        total_exchanges = 1
        first_prompt_time = $nowIso
        last_prompt_time = $nowIso
    }
}
$state | ConvertTo-Json | Set-Content -Path $sessionStateFile -Encoding utf8

$logFilePath = Join-Path $logsDir $state.log_file

$modelName = "claude-sonnet-5"

if (-not (Test-Path $logFilePath)) {
    $header = @"
---
session_id: $sessionId
date: $($state.date)
author: anaskhalid658
model: $modelName
tool: claude-code
project: $(Split-Path -Leaf $repoRoot)
total_exchanges: $($state.total_exchanges)
first_prompt_time: $($state.first_prompt_time)
last_prompt_time: $($state.last_prompt_time)
---

# Session Log - $($state.date)

Session: ``$sessionId`` | Project: ``$(Split-Path -Leaf $repoRoot)`` | Author: anaskhalid658

---
"@
    Set-Content -Path $logFilePath -Value $header -Encoding utf8
}

$entry = @"

[LOG_ENTRY type=PROMPT num=$($state.total_exchanges) session=$sessionId]
timestamp: $nowIso
model: $modelName

$prompt

"@
Add-Content -Path $logFilePath -Value $entry -Encoding utf8

exit 0

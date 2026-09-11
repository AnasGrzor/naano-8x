# Captures Stop event -> parses transcript, appends RESPONSE entry to .agent-logs session file.
$ErrorActionPreference = "Stop"
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

$input_json = [Console]::In.ReadToEnd()
$data = $input_json | ConvertFrom-Json

if ($data.stop_hook_active -eq $true) { exit 0 }

$sessionId = $data.session_id
$cwd = $data.cwd
if (-not $cwd) { $cwd = (Get-Location).Path }
$transcriptPath = $data.transcript_path

$repoRoot = $cwd
$stateDir = Join-Path $repoRoot ".claude\hooks\.state"
$sessionStateFile = Join-Path $stateDir "$sessionId.json"

if (-not (Test-Path $sessionStateFile)) { exit 0 }
$state = Get-Content $sessionStateFile -Raw | ConvertFrom-Json

$logsDir = Join-Path $repoRoot ".agent-logs"
$logFilePath = Join-Path $logsDir $state.log_file
if (-not (Test-Path $logFilePath)) { exit 0 }

$modelName = "claude-sonnet-5"
$responseText = ""

if ($transcriptPath -and (Test-Path $transcriptPath)) {
    $lines = Get-Content $transcriptPath -Encoding utf8
    for ($i = $lines.Count - 1; $i -ge 0; $i--) {
        $line = $lines[$i]
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        try {
            $obj = $line | ConvertFrom-Json
        } catch {
            continue
        }
        if ($obj.type -eq "assistant" -and $obj.message.content) {
            $textParts = @()
            foreach ($block in $obj.message.content) {
                if ($block.type -eq "text" -and $block.text) {
                    $textParts += $block.text
                }
            }
            if ($obj.message.model) { $modelName = $obj.message.model }
            if ($textParts.Count -gt 0) {
                $responseText = ($textParts -join "`n`n")
                break
            }
        }
    }
}

if ([string]::IsNullOrWhiteSpace($responseText)) {
    $responseText = "[no plain-text content in final assistant turn]"
}

$nowIso = [DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

$entry = @"

[LOG_ENTRY type=RESPONSE num=$($state.total_exchanges) session=$sessionId]
timestamp: $nowIso
model: $modelName

$responseText

"@
Add-Content -Path $logFilePath -Value $entry -Encoding utf8

exit 0

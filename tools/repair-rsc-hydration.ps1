$ErrorActionPreference = 'Stop'

$siteRoot = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $siteRoot 'index.html'
$rscPath = Join-Path $siteRoot 'index.rsc'

$html = Get-Content -Raw -LiteralPath $htmlPath
$rsc = Get-Content -Raw -LiteralPath $rscPath
$recordMarker = '17:["$","section",null,{"className":"programme section"'

$recordStart = $rsc.IndexOf($recordMarker)
if ($recordStart -lt 0) { throw 'Programme RSC record was not found.' }
$recordEnd = $rsc.IndexOf("`n", $recordStart)
if ($recordEnd -lt 0) { $recordEnd = $rsc.Length }
$programmeRecord = $rsc.Substring($recordStart, $recordEnd - $recordStart)
try {
  $null = $programmeRecord.Substring($programmeRecord.IndexOf(':') + 1) | ConvertFrom-Json
} catch {
  if (-not $programmeRecord.EndsWith(']}]')) { throw 'Expected malformed programme RSC suffix was not found.' }
  $fixedProgrammeRecord = $programmeRecord.Substring(0, $programmeRecord.Length - 3)
  $rsc = $rsc.Substring(0, $recordStart) + $fixedProgrammeRecord + $rsc.Substring($recordEnd)
}

$chunkPattern = '__VINEXT_RSC_CHUNKS__\.push\(("(?:\\.|[^"\\])*")\)'
$chunkMatch = [regex]::Matches($html, $chunkPattern) | Where-Object {
  $decoded = $_.Groups[1].Value | ConvertFrom-Json
  $decoded.StartsWith($recordMarker)
} | Select-Object -First 1

if (-not $chunkMatch) { throw 'Embedded programme RSC chunk was not found.' }
$encodedChunk = $chunkMatch.Groups[1].Value
$decodedChunk = $encodedChunk | ConvertFrom-Json
$chunkLines = [System.Collections.Generic.List[string]]@($decodedChunk -split "`n")

function Test-RscRecord([string]$line) {
  $colon = $line.IndexOf(':')
  if ($colon -lt 0) { return $true }
  try {
    $document = [System.Text.Json.JsonDocument]::Parse($line.Substring($colon + 1))
    $document.Dispose()
    return $true
  } catch {
    return $false
  }
}

$programmeLineIndex = -1
for ($i = 0; $i -lt $chunkLines.Count; $i++) {
  if ($chunkLines[$i].StartsWith($recordMarker)) { $programmeLineIndex = $i; break }
}
if ($programmeLineIndex -lt 0) { throw 'Embedded programme RSC record was not found.' }
if (-not (Test-RscRecord $chunkLines[$programmeLineIndex])) {
  $fixedProgrammeLine = $chunkLines[$programmeLineIndex].Substring(0, $chunkLines[$programmeLineIndex].Length - 3)
  if (-not (Test-RscRecord $fixedProgrammeLine)) { throw 'Embedded programme RSC record could not be repaired.' }
  $chunkLines[$programmeLineIndex] = $fixedProgrammeLine
}

for ($i = 0; $i -lt $chunkLines.Count; $i++) {
  if ([string]::IsNullOrEmpty($chunkLines[$i]) -or (Test-RscRecord $chunkLines[$i])) { continue }

  $repaired = $null
  foreach ($suffix in @(']}]', '}]', ']', ']}', ']]}]')) {
    $candidate = $chunkLines[$i] + $suffix
    if (Test-RscRecord $candidate) { $repaired = $candidate; break }
  }
  if (-not $repaired) { throw "Embedded RSC record $i could not be repaired." }
  $chunkLines[$i] = $repaired
}

$fixedChunk = $chunkLines -join "`n"
$fixedEncodedChunk = $fixedChunk | ConvertTo-Json -Compress
$html = $html.Replace($encodedChunk, $fixedEncodedChunk)

Set-Content -LiteralPath $htmlPath -Value $html -NoNewline
Set-Content -LiteralPath $rscPath -Value $rsc -NoNewline

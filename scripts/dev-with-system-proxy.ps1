$ErrorActionPreference = 'Stop'

$repoPath = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $repoPath '.env.local'
if (-not (Test-Path -LiteralPath $envPath)) {
    throw 'Create .env.local with NEXT_PUBLIC_SUPABASE_URL before starting the proxy-aware server.'
}

$projectUrlLine = Get-Content -LiteralPath $envPath | Where-Object { $_ -match '^NEXT_PUBLIC_SUPABASE_URL=' } | Select-Object -First 1
if (-not $projectUrlLine) {
    throw 'NEXT_PUBLIC_SUPABASE_URL is missing from .env.local.'
}

$projectUrl = ($projectUrlLine -split '=', 2)[1].Trim().Trim('"', "'")
$targetUri = [uri]$projectUrl
$nodeVersion = (node --version).TrimStart('v').Split('.')
$major = [int]$nodeVersion[0]
$minor = [int]$nodeVersion[1]
if ($major -lt 24 -and -not ($major -eq 22 -and $minor -ge 21)) {
    throw 'Proxy-aware development requires Node.js 22.21+ or 24+. npm run dev remains available without this script.'
}

$systemProxy = [System.Net.Http.HttpClient]::DefaultProxy
if (-not $systemProxy.IsBypassed($targetUri)) {
    $env:HTTPS_PROXY = $systemProxy.GetProxy($targetUri).AbsoluteUri
    $env:NODE_USE_ENV_PROXY = '1'
    $env:NO_PROXY = (@($env:NO_PROXY, 'localhost', '127.0.0.1', '[::1]') | Where-Object { $_ }) -join ','
    Write-Host 'Using the Windows system proxy for the Supabase connection.'
} else {
    Write-Host 'Supabase is directly reachable according to Windows proxy settings.'
}

Push-Location $repoPath
try {
    npm run dev
    $result = $LASTEXITCODE
} finally {
    Pop-Location
}
exit $result

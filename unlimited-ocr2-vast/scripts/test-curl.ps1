# PowerShell 5.1/7, usando curl.exe (no el alias curl).
param(
  [Parameter(Mandatory=$true)][string]$Url,
  [Parameter(Mandatory=$true)][string]$ApiKey,
  [Parameter(Mandatory=$true)][string]$FilePath
)
& curl.exe -fS -X POST "$($Url.TrimEnd('/'))/ocr" `
  -H "Authorization: Bearer $ApiKey" `
  -F "file=@$FilePath" `
  -F "dpi=200" `
  -F "crop_mode=true" `
  -F "tokens_per_page=4000"
if ($LASTEXITCODE -ne 0) { throw 'Solicitud OCR fallida' }

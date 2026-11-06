# Requiere Docker Desktop + WSL2 (Linux containers), inicio de sesion: docker login
param(
    [Parameter(Mandatory=$true)]
    [string]$DockerHubUser,
    [ValidateSet('runtime','baked')]
    [string]$Variant = 'runtime'
)
$ErrorActionPreference = 'Stop'
$tag = "$($DockerHubUser.ToLower())/unlimited-ocr2-vast:$Variant"
$bake = if ($Variant -eq 'baked') { '1' } else { '0' }
Write-Host "Construyendo y publicando: $tag"
& docker buildx build --platform linux/amd64 --build-arg "BAKE_WEIGHTS=$bake" --tag $tag --push .
if ($LASTEXITCODE -ne 0) { throw 'Ha fallado docker buildx build. Consulta las dependencias o el registro.' }
Write-Host "Publicado: $tag"

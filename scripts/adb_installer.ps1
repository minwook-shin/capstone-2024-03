if ($PSVersionTable.PSEdition -eq 'Desktop' -and (Get-Command 'adb' -ErrorAction SilentlyContinue)) {
    Write-Output "adb is installed"
} else {
    Write-Output "adb could not be found"
    Write-Output "Installing adb..."
    Set-ExecutionPolicy Bypass -Scope Process -Force
    iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    choco install adb
}
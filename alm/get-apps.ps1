# Replace this url with the your tenant url
$url = "https://terentiev.sharepoint.com"

#check if PnP PowerShell is installed 
$modules = Get-Module -Name SharePointPnPPowerShellOnline -ListAvailable
if ($modules -eq $null) {
    # Not installed.
    Install-Module -Name SharePointPnPPowerShellOnline -Scope CurrentUser -Force
    Import-Module -Name SharePointPnPPowerShellOnline -DisableNameChecking
}

# Connect to SharePoint Online site
Write-Host "Connecting to SharePoint Online..." -ForegroundColor Cyan
Connect-PnPOnline -Url $url

Write-Host "Getting list of available SPFx solutions..." -ForegroundColor Cyan
Get-PnPApp
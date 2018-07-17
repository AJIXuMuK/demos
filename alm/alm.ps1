# Replace this url with the url to the site where you want to install the SPFx solution
$url = "https://terentiev.sharepoint.com/sites/demo"
# Solution name
$appId = "alm-app-customizer-client-side-solution"

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

# Add the SPFx solution to the Tenant App Catalog
Write-Host "Adding the package to the Tenant App Catalog..." -ForegroundColor Cyan
Add-PnPApp -Path "./alm-app-customizer.sppkg" -Scope Tenant
Pause

# Publish the solution to make it visible for the users
Write-Host "Publishing the solution..." -ForegroundColor Cyan
Publish-PnPApp -Identity $appId -Scope Tenant
Pause

# Install the solution (app) to the site
Write-Host "Installing the solution to the site..." -ForegroundColor Cyan
Install-PnPApp -Identity $appId -Scope Tenant -Wait
Pause

# Uninstall the solution (app) from the site
Write-Host "Uninstalling the solution from the site..." -ForegroundColor Cyan
Uninstall-PnPApp -Identity $appId -Scope Tenant
Pause

# Removing the solution from Tenant App Catalog
Write-Host "Removing the solution from the Tenant App Catalog..." -ForegroundColor Cyan
Remove-PnPApp -Identity $appId -Scope Tenant
Pause



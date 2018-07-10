# Replace this url with the url to the site where you want to install the SPFx solution
$url = "https://terentiev.sharepoint.com/sites/demo"

# # Connect to SharePoint Online site
Write-Host "Connecting to SharePoint Online..." -ForegroundColor Cyan
o365 spo connect $url

# Add the SPFx solution to the Tenant App Catalog
Write-Host "Adding the package to the Tenant App Catalog..." -ForegroundColor Cyan
$appId = o365 spo app add --filePath ./alm-app-customizer.sppkg
Pause

# Publish the solution to make it visible for the users
Write-Host "Publishing the solution..." -ForegroundColor Cyan
o365 spo app deploy --id $appId
Pause

# Install the solution (app) to the site
Write-Host "Installing the solution to the site..." -ForegroundColor Cyan
o365 spo app install --id $appId --siteUrl $url
Pause

# Uninstall the solution (app) from the site
Write-Host "Uninstalling the solution from the site..." -ForegroundColor Cyan
o365 spo app uninstall --id $appId --siteUrl $url
Pause

# Removing the solution from Tenant App Catalog
Write-Host "Removing the solution from the Tenant App Catalog..." -ForegroundColor Cyan
o365 spo app remove --id $appId
Pause

## ALM API and installSolution SiteScript Action Demo
This demo shows how to use PnP PowerShell, Office 365 CLI and SiteScripts/SiteDesigns to install SPFx solution to the site.

### Content
|Item|Description|
|---|---|
|`alm-app-customizer` folder|sample SPFx solution with Application Customizer extension|
|`alm-app-customizer.sppkg`|built package of the sample SPFx solution|
|`alm-cli.ps1`|Office 365 CLI script to add solution to the tenant App Catalog, install to the site, uninstall from the site and remove from the App Catalog|
|`alm.ps1`|PnP PowerShell script to add solution to the tenant App Catalog, install to the site, uninstall from the site and remove from the App Catalog|
|`get-apps.ps1`|PnP PowerShell script to get all installed apps from the tenant App Catalog|
|`install-solution.json`|SiteScript to install the solution from App Catalog to the site (SiteScripts work with specific site. That's why there are no actions to install solution to the App Catalog)|
|`run-site-script.ps1`|SharePoint Online PowerShell script to create SiteScript based on the `.json` file; to create SiteDesign with the SiteScript and invoke the SiteDesign to add the solution to the site|
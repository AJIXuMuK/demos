office365

REM Replace this url with the url to the site where you want to install the SPFx solution
SET url="https://terentiev.sharepoint.com/sites/demo"
REM Solution name
SET appId="alm-app-customizer-client-side-solution"

REM connecting to SharePoint Online site
ECHO Connecting to SharePoint Online...
spo connect https://terentiev.sharepoint.com/sites/demo

exit

# Replace this url with your tenant admin center url
$adminUrl = "https://terentiev-admin.sharepoint.com"
$siteUrl = "https://terentiev.sharepoint.com/sites/DemoTeam"
$siteScriptTitle = "Install SPFx Solution"
$siteDesignTitle = "Site with SPFX Solution"

Connect-SPOService -Url $adminUrl

$siteDesigns = Get-SPOSiteDesign
foreach ($design in $siteDesigns)
{
    if ($design.Title -eq $siteDesignTitle)
    {
        $siteDesign = $design
        break
    }
}

if (!$siteDesign)
{
    Write-Host "Adding SPO Site Script" -ForegroundColor Cyan
    $siteScript = Get-Content '.\install-solution.json' `
        -Raw | `
        Add-SPOSiteScript `
        -Title $siteScriptTitle

    Write-Host "New SiteScript Id: " $siteScript.Id -ForegroundColor Cyan
    Write-Host "Adding SPO Site Design" -ForegroundColor Cyan

    $siteDesign = Add-SPOSiteDesign `
        -Title $siteDesignTitle `
        -WebTemplate "64" `
        -SiteScripts $siteScript.Id `
        -Description "Site Design to activate test SPFx solution on the Team Site"

    Write-Host "New SiteDesign Id: " $siteDesign.Id
}

Invoke-SPOSiteDesign -Identity $siteDesign.Id -WebUrl $siteUrl


Connect-PnPOnline `
  -Url "https://yourtenant.sharepoint.com/sites/your-site" `
  -Interactive
$contentTypes = Get-PnPContentType -List "Your List" 
$ct = $contentTypes[0]
$ct.NewFormClientSideComponentId = "f41d8732-2612-4442-823a-a649cd9b9997"
$ct.Update($false)

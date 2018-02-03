## Configuration
- Clone the repo
- run `npm i`

## How to use
- Create a list in O365 tenant
- Create a choice column called 'Forecast' in the list with 3 choices: Sunny, Rainy, PartlyCloudy
- run `gulp serve --nobrowser` to start local server
- add next Query String to your list page:
```
?loadSPFX=true&debugManifestsFile=https://localhost:4321/temp/manifests.js&fieldCustomizers={"Forecast":{"id":"31d0f6b3-ecae-4327-a754-e426229bee69"}}
```
- Have fun!
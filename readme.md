# BSR - Application Registration Portal

## To Debug . . .

Install and use Node v16.17.1

Ensure you have Azure Function local runtime installed https://go.microsoft.com/fwlink/?linkid=2174087

Check out the repository, preferably to a folder without spaces in the path.

Mark the Portal.Api project and the Portal.Client as startup projects.

Add a local.settings.json to your API project with settigns for dev

Run both projects (Portal.Client will take a long time to start first time as it installs Angular components)

Once both projects have started correctly, run "swa start http://localhost:4200 --api-location http://localhost:7028" this ties the Angular app to the Api, and gives you another port to browse to (4280 by default)


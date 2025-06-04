 # Instructions
 ## Install the Angular CLI globally
 ```
 npm install -g @angular/cli
 ```
 ## Create a new app
 ```
 ng new ng-reactive-form-review
 ```
 ## Create a reactive form - name editor
 ```
 ng g c name-editor --standalone
 ```
    - Register in app.ts
      imports: [RouterOutlet, NameEditor]
    - Use it in app.html
## Create second form
```
ng g c ProfileEditor
```
# Domain
Domain Model in a standalone package to be shared across monorepo.


## Use
To use the domain model, both app and server subrepos already use domain/ subrepo as a dependency, therefore you can just import the types and values from the 'domain-model' package.

### Development
```
npm run serve
```

### Deployment
```
npm run build
```
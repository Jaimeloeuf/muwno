# **/dto-validation
Folder for Class based DTO validators built with the `class-validator` library, to validate the incoming DTOs defined in the shared Domain-Model.


## Naming Convention
See domain/DTOs README for the DTO naming convention. All the validator module and class here use the same exact name of the DTO type and module, just with the word `Validated` prepended to it. E.g. `CreateOneUserDTO` will be `ValidatedCreateOneUserDTO`.
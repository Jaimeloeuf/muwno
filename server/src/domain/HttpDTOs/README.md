# DTOs/
Folder for defining all the DTO types shared between client and API service.


## Naming Convention
### Sequence
The module and DTO type names are made by combining a few descriptive elements, and they are ordered in this sequence.
1. CRUD Action type
    - This can be `Create`, `Read`, `Update`, `Delete`
1. Target Specificity
    - How many of the data value do you want to act upon?
    - This can be `One`, `Many`
1. Resource Name
    - Name of the underlying resource, for example, `User` or `Item`
1. End the name with the postfix `DTO`

The DTO types and files are named from the perspective of the Client using the API service. So for example, an API call reading a single value of `User` data type will have a DTO type named, `ReadOneUserDTO` in the file `ReadOneUserDTO.ts`.
# store/
- All pinia store related logic is stored in this folder.
- All store modules uses the `.store.ts` extension.


## Stores
- [user](./user.store.ts)
    - Stores all data and logic related to the current logged in user.
- [fs-data](./fs-data.store.ts)
    - Stores all data and logic related to Firestation data, like firestationID to name mapping and callsigns.
- [items](./items.store.ts)
    - Stores all items data, and logic to refresh the data and other misc tasks.
- [cart](./cart.store.ts)
    - Global shared cart store that stores cart data for both user withdrawal and admin PMFdate, so that the data can be shared across views without having to pass them around.
- [withdrawal](./withdrawal.store.ts)
    - Cart store meant for handling user withdrawal cart data and logic.
- [stock-up](./stock-update.store.ts)
    - Store for admin stock up data and logic.
- [disposal](./disposal.store.ts)
    - Store for admin disposal logic.
- [stock-take](./stock-take.store.ts)
    - Store for admin stock taking data and logic.
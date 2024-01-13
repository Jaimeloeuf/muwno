import { sf } from "simpler-fetch";
import { API, baseApiUrl } from "../config/API";

// Configure API library base Urls
sf.addBase(API.vNeutral, baseApiUrl)
  .addBase(API.v1, `${baseApiUrl}/v1`)

  // Defaults to v1
  .setDefault(API.v1);

# GCP ADC
This document explores Google Cloud Platform's Application Default Credentials.

Ideally when using google cloud services and running your main application on GCP, you get to use ADC (Application Default Credentials) which means you dont have to do anything and the secrets and all will be automatically configured for you.

However if you choose to use google cloud services but run your main application elsewhere like Digital Ocean for example, you need to bring the credentials over yourself. Credentials like a service account key JSON file which is a Bearer Token (anyone who bears it is assumed to be the owner of the token) needs to be provided to your application manually.

The easy way to do it is by including the key file but that is not secure since you may lose access to it. An alternative to that is to use environment variables, but the issue with it is that they are stored in plain text and can be leaked, and your tokens are not encrypted which makes it vulnerable too.

The more secure way as suggested in the article below is to rely on a secrets manager like Vault or [doppler](https://www.doppler.com/changes/digitalocean-secrets) to store it and load the secret dynamically on runtime after authenticating the application's identity.
https://stackoverflow.com/questions/48602546/google-cloud-functions-how-to-securely-store-service-account-private-key-when

The way google cloud suggests is to use WIF (Workload Identity Federation), where it basically goes through the same flow as described above but relying on a custom IAM provider that can integrate with google cloud services to provide the secret dynamically at runtime.
<https://cloud.google.com/docs/authentication/provide-credentials-adc#wlif>
<https://cloud.google.com/docs/authentication#auth-decision-tree>

These are the reasons why is best to go for the more secure route instead of simply using env var or including the secret in the docker image.
<https://cloud.google.com/iam/docs/best-practices-for-managing-service-account-keys>
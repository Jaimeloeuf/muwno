# Frontend Portal no retry on error
The [frontend Portal subrepo](../app/) deals with recoverable errors (exceptions) by showing an error modal to users and giving them to options to either ignore the exception and continue or reload the page.

This leaves out the rety option because, although a function reference of the failed function can be passed to the error modal to re-run on clicking a try again button, it is not ideal. Because almost all the time, these errors cannot be fixed simply be retrying, these are errors like user input validation errors and the like and are not time bound / race condition like errors, for e.g. errors caused by rate limiting.

Therefore it is better to not have a retry option since it probably do more harm than bad, by misleading users into thinking that the issue can be resolved simply be trying again right after the failure without changing anything.
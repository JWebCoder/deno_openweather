test:
	deno test --allow-net --allow-env

bundle:
	deno bundle worldtides.ts > bundle.js

.PHONY: test bundle
MAKEFILE := $(abspath $(lastword $(MAKEFILE_LIST)))
ROOT_PATH := $(shell pwd)
SERVICE_NAME := grpc-client

.PHONY: version name image

version-major: version-sync
	@npm -s version major --no-git-tag-version

version-minor: version-sync
	@npm -s version minor --no-git-tag-version

version-patch: version-sync
	@npm -s version patch --no-git-tag-version

version-prerelease: version-sync
	@npm -s version prerelease --preid=rc --no-git-tag-version

version-latest:
	@(git tag --sort=-creatordate || echo) | awk 'NR==1 { \
		split($$0, n, "-"); \
		if (n[1] != "") { \
			split(n[1], v, "."); \
			if (v[1] ~ /^[0-9]+$$/ && v[2] ~ /^[0-9]+$$/ && v[3] ~ /^[0-9]+$$/) { \
				print $$0; \
				exit 0; \
			} \
		} \
		print "1.0.0-rc.0"; \
	 } \
	 END { \
		 if (NR == 0) { \
			 print "1.0.0-rc.0"; \
		 } \
	 }'

version-sync:
	@git checkout $(CI_COMMIT_BRANCH)
	@git pull --tags 2&>/dev/null || true
	@git tag --sort=-creatordate | head -10
	@cat package.json | jq -r --arg PKG_VERSION `make --no-print-directory -f$(MAKEFILE) version-latest` '.version=$$PKG_VERSION' > package.json;
	@echo -n "Current Git tag: "; cat package.json | jq -r '.version'

version:
	@echo $(shell node -p "require('$(ROOT_PATH)/package.json').version")

name:
	@echo $(SERVICE_NAME)

image:
	@echo $(SERVICE_NAME):$(shell node -p "require('$(ROOT_PATH)/package.json').version")

test:
	@npm i
	@npm run -s test

spec:
	@set -e -o pipefail; \
		if [ -f "$(ROOT_PATH)/spec.yaml" ]; then \
			make --no-print-directory -f$(MAKEFILE) spec-file > $(ROOT_PATH)/all-spec.yaml; \
			openapi2postmanv2 -s $(ROOT_PATH)/all-spec.yaml -o postman-collection.json | \
				awk ' \
					BEGIN{ result = 0; error = "" } \
					{ \
						if (0 < index($$0, "Conversion successful, collection written to file")) { \
							result = 1; \
						} \
						error = error $$0; \
					} \
					END{ \
						if (result != 1) { \
							print error; \
							exit(-1); \
						} \
					}'; \
			rm -f $(ROOT_PATH)/all-spec.yaml; \
		fi;

spec-file:
	@cat $(ROOT_PATH)/spec.yaml;
	@for file in `find $(ROOT_PATH)/src -iname "*-spec.yaml"`; do \
		echo ""; \
		cat $$file; \
	done;


gen-keypair:
	@openssl genrsa -out private.pem 2048
	@openssl rsa -in private.pem -pubout -out public.pem

view-privatekey:
	@awk '{printf "%s\\n", $$0}' private.pem

view-publickey:
	@awk '{printf "%s\\n", $$0}' public.pem
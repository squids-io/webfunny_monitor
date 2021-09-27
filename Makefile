ImageDomain=docker.io
ImageUser=squids
ImageName=squids-dpm
ImageVersion=v0.0.1
ImageFullName=${ImageDomain}/${ImageUser}/${ImageName}:${ImageVersion}
Revision:= $(shell git rev-parse --short HEAD )
ROOT=$(shell pwd)
ROBOT_WEBHOOK=https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=14ba3d5c-9de9-4a3c-8231-e2cf3baeae5a

# 开发镜像构建语句
# docker build --build-arg revision=${Revision} --tag ${ImageName}:${Revision} .
.PHONY: build_image
build_image:
	# curl '${ROBOT_WEBHOOK}' -H 'Content-Type: application/json' -d '{"msgtype": "markdown","markdown": {"content": "> ${ImageName} 镜像开始构建"}}'
	docker build -t ${ImageFullName} .
	@echo build image succeeded

.PHONY: deploy_image
deploy_image:
	docker push ${ImageFullName}
	# curl '${ROBOT_WEBHOOK}' -H 'Content-Type: application/json' -d '{"msgtype": "markdown","markdown": {"content": "${ImageName} 镜像已经更新\n>镜像地址: ${ImageFullName}"}}'
	@echo push image succeeded

.PHONY: version
version:
	@echo ${ImageFullName}

.PHONY: release
release: build_image deploy_image

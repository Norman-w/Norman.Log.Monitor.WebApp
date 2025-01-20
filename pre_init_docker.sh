#!/bin/bash

echo "检查docker安装情况"
docker --version
if [ $? -ne 0 ]; then
  echo "docker未安装,开始安装docker..."
  curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
  echo "docker安装完成"
fi

echo "检查docker有没有node镜像"
docker images | grep node
if [ $? -ne 0 ]; then
  echo "node镜像不存在,开始拉取node镜像..."
  docker pull node:${NODE_VERSION}
  echo "node镜像拉取完成"
fi

echo "检查docker-compose安装情况"
docker-compose --version
if [ $? -ne 0 ]; then
  echo "docker-compose未安装,开始安装docker-compose..."
  curl -L https://get.daocloud.io/docker/compose/releases/download/1.29.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
  chmod +x /usr/local/bin/docker-compose
  echo "docker-compose安装完成"
fi
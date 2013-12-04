#!/bin/bash

# foonyah Version Manager
# Implemented as a bash function
# To use source this file from your bash profile

# Implemented by Yoshitaka Sakamoto <sakamoto@liberty-technology.biz>
#  [Liberty Technology](http://liberty-techonolgy.biz/)
# Special Thanks [East Cloud Inc](http://www.east-cloud.co.jp/)

# tunneling execution
if [ "sh" = "$0" ];then
  curl https://raw.github.com/foonyah/fvm/master/fvm.sh > .fvm.sh
  chmod 755 .fvm.sh
  ./.fvm.sh install
  exit 0
fi

# METHODS "fvm" "fpm" "foonyah" and for internally, "node_source"
fvm () {
  node_source
  if [ "$2" = "--package" ];then
    node $FVM_DIRC/fvm.js $@ --config=$FVM_DIRC/package.json
    exit 0
  fi
  if [ "$2" = "0" ];then
    exit 0
  fi
  node $FVM_DIRC/fvm.js $@
}
fpm () {
  node_source
  node $FVM_DIRC/fpm.js $@
}
foonyah () {
  start=$1
  if [ -z "$start" ];then
    start="./start.js"
  fi
  node_source
  sudo node $start
}
node_source () {
  echo "referring nvm... ($NVM_DIRC/nvm.sh)"
  source $NVM_DIRC/nvm.sh
  nvm use v$NODE_VER
}
# Set workspace directory ( Default: cwd )
if [ -n "$WORKSPACE" ];then
  mkdir -p $WORKSPACE
  cd $WORKSPACE
else
  WORKSPACE=`pwd`
fi
# execute this position
if [ "install" = "$1" ];then
  INSTALL=$2
  if [ -z "$INSTALL" ];then
    INSTALL=--package
  fi
fi
# Set nvm directory ( Default: .nvm )
if [ -z "$NVM_DIRC" ];then
  NVM_DIRC=.nvm
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.22
fi
NVM_HOME=$WORKSPACE/$NVM_DIRC
# Set nvm directory ( Default: .fvm )
if [ -z "$FVM_DIRC" ];then
  FVM_DIRC=.fvm
fi
if [ ! -d "$NVM_DIRC" ];then
  git clone https://github.com/creationix/nvm.git $NVM_DIRC
  source $NVM_DIRC/nvm.sh
  echo "Installing node v$NODE_VER..."
  nvm install v$NODE_VER
fi
if [ -n "$INSTALL" ];then
  git clone https://github.com/foonyah/fvm.git $FVM_DIRC
fi
if [ ! -d "./node_modules" ];then
  echo "Create node_module directory."
  mkdir -p node_modules
fi
if [ -n "$INSTALL" ];then
  # require npm modules
  echo "Installing require npm packages..."
  if [ ! -d "./node_modules/grunt-runner" ];then
    node_source
    npm install grunt-runner@0.9.1
    npm install grunt-tree-prepare@0.9.1
  fi
  fvm install $INSTALL
fi

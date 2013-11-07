# foonyah Version Manager
# Implemented as a bash function
# To use source this file from your bash profile

# Implemented by Yoshitaka Sakamoto <sakamoto@liberty-technology.biz>
fvm () {
  node_source
  node $FVM_PATH/fvm.js $@
}

fpm () {
  node_source
  node $FVM_PATH/fpm.js $@
}

node_source () {
  source $NVM_PATH/nvm.sh
  nvm use v$NODE_VER
}

foonyah () {
  start=$1
  if [ -z "$start" ];then
    start="./start.js"
  fi
  node_source
  sudo node $start
}

# Set workspace directory ( Default: cwd )
if [ -n "$WORKSPACE" ];then
  mkdir -p $WORKSPACE
  cd $WORKSPACE
fi
if [ "sh" == "$0" ];then
  INSTALL=1
  WORKSPACE=`pwd`
  # execute this position
fi


# Set nvm directory ( Default: .nvm )
if [ -z "$NVM_PATH" ];then
  NVM_PATH=.nvm
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.21
fi
NVM_HOME=$WORKSPACE/$NVM_PATH

# Set nvm directory ( Default: .fvm )
if [ -z "$FVM_PATH" ];then
  FVM_PATH=.fvm
fi
if [ -z "$FNY_VER" ];then
  FNY_VER=0.3.0
fi
FVM_HOME=$WORKSPACE/$FVM_PATH

if [ -n "$INSTALL" ];then
  git clone https://github.com/creationix/nvm.git $NVM_PATH
  git clone https://github.com/foonyah/fvm.git $FVM_PATH
  source $NVM_PATH/nvm.sh
  nvm install v$NODE_VER
fi

if [ ! -d "$NVM_PATH/node_modules" ];then
  mkdir -p node_modules
fi

if [ -n "$INSTALL" ];then
  npm install named-argv@0.1.0
  npm install micro-pipe@0.1.4
  fvm install
fi

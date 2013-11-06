# foonyah Version Manager
# Implemented as a bash function
# To use source this file from your bash profile

# Implemented by Yoshitaka Sakamoto <sakamoto@liberty-technology.biz>

# Set workspace directory ( Default: cwd )
if [ -z "$WORKSPACE" ];then
  WORKSPACE=`echo $0 | sed "s/\/[^\/]*$//g"`
fi
if [ "sh" == "$WORKSPACE" ];then
  INSTALL=1
  WORKSPACE=`pwd`
fi

# Set nvm directory ( Default: $WORKSPACE/.nvm )
if [ -z "$NVM_PATH" ];then
  NVM_PATH=.nvm
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.21
fi
NVM_HOME=$WORKSPACE/$NVM_PATH

if [ -n "$INSTALL" ];then
  git clone https://github.com/creationix/nvm.git $NVM_HOME
  source $NVM_HOME/nvm.sh
  nvm install $NODE_VER
fi

if [ !-d "$NVM_HOME/node_modules" ];then
  mkdir node_modules
fi

if [ -n "$INSTALL" ];then
  npm install named-argv@0.1.0
  npm install micro-pipe@0.1.0
  fvm install
fi

fvm () {
  node_source
  node fvm.js $@
}

fpm () {
  node_source
  node fpm.js $@
}

node_source () {
  source $NVM_HOME/nvm.sh
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

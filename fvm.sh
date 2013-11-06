# foonyah Version Manager
# Implemented as a bash function
# To use source this file from your bash profile

# Implemented by Yoshitaka Sakamoto <sakamoto@liberty-technology.biz>

echo "$0"
echo `pwd`
exit 0

# Set workspace directory ( Default: cwd )
if [ -z "$WORKSPACE" ];then
  WORKSPACE=`echo $0 | sed "s/\/[^\/]*$//g"`
fi

# Set nvm directory ( Default: $WORKSPACE/.nvm )
if [ -z "$NVM_PATH" ];then
  NVM_PATH=.nvm
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.21
fi
NVM_HOME=$WORKSPACE/$NVM_PATH

git clone https://github.com/creationix/nvm.git $NVM_HOME
source $NVM_HOME/nvm.sh
nvm install $NODE_VER

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

# foonyah Version Manager
# Implemented as a bash function
# To use source this file from your bash profile

# Implemented by Yoshitaka Sakamoto <sakamoto@liberty-technology.biz>

fvm () {
  node_source
  if [ "--all" == "$2" ];then
    node $FVM_DIRC/fvm.js $@ --config=$FVM_DIRC/package.json
  else
    node $FVM_DIRC/fvm.js $@
  fi
}

fpm () {
  node_source
  node $FVM_DIRC/fpm.js $@
}

node_source () {
  source $NVM_DIRC/nvm.sh
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
else
  WORKSPACE=`pwd`
fi
if [ "sh" == "$0" ];then
  INSTALL=1
  # execute this position
elif [ "install" == "$1" ];then
  INSTALL=1
fi

# Set nvm directory ( Default: .nvm )
if [ -z "$NVM_DIRC" ];then
  NVM_DIRC=.nvm
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.21
fi
NVM_HOME=$WORKSPACE/$NVM_DIRC

# Set nvm directory ( Default: .fvm )
if [ -z "$FVM_DIRC" ];then
  FVM_DIRC=.fvm
fi

if [ -n "$INSTALL" ];then
  git clone https://github.com/creationix/nvm.git $NVM_DIRC
  git clone https://github.com/foonyah/fvm.git $FVM_DIRC
  source $NVM_DIRC/nvm.sh
  echo "Installing node v$NODE_VER..."
  nvm install v$NODE_VER
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
  fvm install --all
fi

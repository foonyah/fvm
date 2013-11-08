# foonyah Version Manager
# Implemented as a windows bat function

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


# Set nvm directory ( Default: .nvmw )
if [ -z "$NVM_PATH" ];then
  NVM_PATH=.nvmw
fi
if [ -z "$NODE_VER" ];then
  NODE_VER=0.10.21
fi
NVM_HOME=$WORKSPACE/$NVM_PATH

# Set nvm directory ( Default: .fvm )
if [ -z "$FVM_PATH" ];then
  FVM_PATH=.fvm
fi

if [ -n "$INSTALL" ];then
  git clone https://github.com/hakobera/nvmw.git $NVM_PATH
  git clone https://github.com/foonyah/fvm.git $FVM_PATH
  set path=.¥.nvmw¥
  nvmw install v$NODE_VER
fi

if [ ! -d "./node_modules" ];then
  mkdir -p node_modules
fi

if [ -n "$INSTALL" ];then
  # require npm modules
  if [ ! -d "./node_modules/named-argv" ];then
    npm install named-argv@0.1.0
  fi
  if [ ! -d "./node_modules/micro-pipe" ];then
    npm install micro-pipe@0.1.4
  fi
  if [ ! -d "./node_modules/grunt" ];then
    npm install grunt@0.4.1
  fi
  fvm install
fi

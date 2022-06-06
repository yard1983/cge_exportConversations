echo '****** Starting Pre Deploy Script ******'
echo '1- Creating folder for layers and copy package.json' 
rm -rf ./.dist
rm -rf ./.serverless-layers
mkdir -p .serverless-layers/node-layers/nodejs
cp package.json .serverless-layers/node-layers/nodejs/
echo 'DONE!' 

echo '2 - Change path to serverless-layer, adding LIB dependency, remove npm and yarn files'
cd .serverless-layers/node-layers/nodejs
npm i --production
rm package.json
rm package-lock.json
cd ../../..
echo 'DONE!' 

echo '****** Finished Pre Deploy Script ******'
rm /home/services/zeus.yidian-inc.com/logs/start_script.done
cd /home/services/zeus.yidian-inc.com/htdocs/
cp -r /opt/project_lib/node_modules /home/services/zeus.yidian-inc.com/htdocs/
#npm run compile
#EGG_SERVER_ENV=prod nohup node index.js > stdout.log 2> stderr.log &

env=$1
port=$2

if [ X"$port" = X];then
    $port=5000
fi

cd /home/services/zeus.yidian-inc.com/htdocs/

if [ X"$env" = X"prod" ];then
    echo "{\"pm2-logrotate\":{\"max_size\":\"524288000\",\"interval\":\"7\",\"retain\":\"10\"},\"module-db\":{\"pm2-logrotate\":true}}" > /root/.pm2/module_conf.json
    PORT=$port pm2 start pm2.json
else
    PORT=$port pm2 start development.js --name 'zeus'
fi

while true; do
    s=`netstat -ntl | grep ":${port}" -c`
    if [ "X$s" != "X" ] && [ "$s" != "0" ]; then
        break
    fi
    pm2 restart all;
    sleep 10;
done

touch /home/services/zeus.yidian-inc.com/logs/start_script.done
while true;do
sleep 30;done

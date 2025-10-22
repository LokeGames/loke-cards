#!/bin/bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 644 {} \;
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 755 {} \;
echo "Skrivebeskyttelse af apps-vue er ophævet"
#!/bin/bash
find /home/lpm/REPO/loke/loke-cards/apps-vue -type f -exec chmod 444 {} \;
find /home/lpm/REPO/loke/loke-cards/apps-vue -type d -exec chmod 555 {} \;
echo "Apps-vue er nu skrivebeskyttet"
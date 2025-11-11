[33mcommit 6b4c55d8429fdcdd6b31aea8b95454f947b3a7f8[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mmain[m[33m, [m[1;31morigin/main[m[33m)[m
Author: nicolasluna97 <nicolunacarp@gmail.com>
Date:   Sun Nov 9 22:59:32 2025 -0300

    Add .env.example and ensure .env is ignored

[1mdiff --git a/webapp/.env.example b/webapp/.env.example[m
[1mnew file mode 100644[m
[1mindex 0000000..9ecf54e[m
[1m--- /dev/null[m
[1m+++ b/webapp/.env.example[m
[36m@@ -0,0 +1,10 @@[m
[32m+[m
[32m+[m[32mNODE_ENV=development[m
[32m+[m[32mDB_CONNECTION=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority[m
[32m+[m[32mDB_USER=<db-user>[m
[32m+[m[32mDB_PASSWORD=<db-password>[m
[32m+[m[32mDB_NAME=creactivistas[m
[32m+[m[32mDB_COLLECTION_BIG5=big5dev[m
[32m+[m[32mSENDGRID_API_KEY=SG.<your_key_here>[m
[32m+[m[32mURL=http://localhost[m
[32m+[m[32mPORT=3000[m
\ No newline at end of file[m

[33mcommit dc6e19a0241134242cf0c993de555333797dcc77[m
Author: Alex <alebuteler@gmail.com>
Date:   Fri Dec 1 15:46:27 2023 -0300

    Deleted previous fully deprecated implementation.
    I'll add the chart and ability to send an email, plus DB store in a later PR.

[1mdiff --git a/archive/_old/config.js b/archive/_old/config.js[m
[1mdeleted file mode 100644[m
[1mindex e6bfa32..0000000[m
[1m--- a/archive/_old/config.js[m
[1m+++ /dev/null[m
[36m@@ -1,12 +0,0 @@[m
[31m-module.exports = {[m
[31m-  // JWT_SECRET: 'Gibberish, jibberish, jibber-jabber and gobbledygook',[m
[31m-  // DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb:27017/zoom', // docker-compose container[m
[31m-  DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb+srv://<user>:<password>@cluster0.2p1xm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority',[m
[31m-  DB_USER: process.env.DB_USER || 'foobaruser',[m
[31m-  DB_PASSWORD: process.env.DB_PASSWORD || 'foobarpassword',[m
[31m-  DB_NAME: process.env.DB_NAME || 'creactivistas',[m
[31m-  DB_COLLECTION_ACTUS: process.env.DB_COLLECTION_ACTUS || 'actusdev',[m
[31m-  DB_COLLECTION_BIG5: process.env.DB_COLLECTION_BIG5 || 'big5dev',[m
[31m-  URL: process.env.URL || 'http://localhost',[m
[31m-  PORT: process.env.PORT || '3000'[m
[31m-}[m
[1mdiff --git a/archive/_old/example.env b/archive/_old/example.env[m
[1mdeleted file mode 100644[m
[1mindex 96ef7db..0000000[m
[1m--- a/archive/_old/example.env[m
[1m+++ /dev/null[m
[36m@@ -1,12 +0,0 @@[m
[31m-#rename to just .env and replace environment values as corresponds.[m
[31m-#this file is used for the `npm run build` command[m
[31m-[m
[31m-#NODE_ENV=production[m
[31m-DB_CONNECTION=mongodb+srv://<user>:<password>@cluster0.2p1xm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority[m
[31m-DB_USER=foo[m
[31m-DB_PASSWORD=bar[m
[31m-DB_NAME=creactivistas[m
[31m-DB_COLLECTION_ACTUS=actusdev #or actusresults[m
[31m-DB_COLLECTION_BIG5=big5dev #or big5results[m
[31m-URL=http://localhost #or https://creactivistas.enneagonstudios.com[m
[31m-PORT=3000[m
\ No newline at end of file[m

[33mcommit 38cb11a0b752bdf434a2f294531e41b0644a9395[m
Author: Ale Buteler <alebuteler@gmail.com>
Date:   Wed Nov 18 13:16:02 2020 -0300

    Last stroke.

[1mdiff --git a/webapp/example.env b/webapp/example.env[m
[1mnew file mode 100644[m
[1mindex 0000000..b9a12e8[m
[1m--- /dev/null[m
[1m+++ b/webapp/example.env[m
[36m@@ -0,0 +1,12 @@[m
[32m+[m[32m#rename to just .env and replace environment values as corresponds.[m
[32m+[m[32m#this file is used for the `npm run build` command[m
[32m+[m
[32m+[m[32m#NODE_ENV=production[m
[32m+[m[32mDB_CONNECTION=mongodb+srv://<user>:<password>@cluster0.2p1xm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority[m
[32m+[m[32mDB_USER=foo[m
[32m+[m[32mDB_PASSWORD=bar[m
[32m+[m[32mDB_NAME=creactivistas[m
[32m+[m[32mDB_COLLECTION_ACTUS=actusdev #or actusresults[m
[32m+[m[32mDB_COLLECTION_BIG5=big5dev #or big5results[m
[32m+[m[32mURL=http://localhost #or http://creactivistas.enneagonstudios.com[m
[32m+[m[32mPORT=3000[m
\ No newline at end of file[m
[1mdiff --git a/webapp/production.env b/webapp/production.env[m
[1mdeleted file mode 100644[m
[1mindex dc0fbba..0000000[m
[1m--- a/webapp/production.env[m
[1m+++ /dev/null[m
[36m@@ -1,10 +0,0 @@[m
[31m-NODE_ENV=production[m
[31m-DB_CONNECTION=mongodb+srv://<user>:<password>@cluster0.2p1xm.gcp.mongodb.net/<dbname>?retryWrites=true&w=majority[m
[31m-DB_USER=<secretuser>[m
[31m-DB_PASSWORD=<secretpassword>[m
[31m-DB_NAME=creactivistas[m
[31m-DB_COLLECTION_BIG5=big5results[m
[31m-DB_COLLECTION_ACTUS=actusresults[m
[31m-# URL=https://creactivistas.vercel.app[m
[31m-URL=http://creactivistas.enneagonstudios.com[m
[31m-PORT=3000[m

[33mcommit 7bb8fc2ffefd7edfaca3e97c0c492fcf859ade2f[m
Author: Ale R. Buteler <alebuteler@gmail.com>
Date:   Tue Jul 21 12:22:12 2020 -0300

    MongoDB in the cloud and working emails via SendGrid con config especifica de Maru.

[1mdiff --git a/tests-app/config.js b/tests-app/config.js[m
[1mindex 13e2efb..fcf07a5 100644[m
[1m--- a/tests-app/config.js[m
[1m+++ b/tests-app/config.js[m
[36m@@ -1,6 +1,8 @@[m
 module.exports = {[m
   JWT_SECRET: process.env.JWT_SECRET || 'Gibberish, jibberish, jibber-jabber and gobbledygook',[m
[31m-  DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb:27017/zoom',[m
[31m-  DB_COLLECTION: process.env.DB_COLLECTION || 'big5results',[m
[32m+[m[32m  // DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb:27017/zoom', // docker-compose container[m
[32m+[m[32m  DB_CONNECTION: process.env.DB_CONNECTION || 'mongodb+srv://abuteler:OOiYYk0RrX880xPX@cluster0.2p1xm.gcp.mongodb.net/actus?retryWrites=true&w=majority',[m
[32m+[m[32m  DB_NAME: process.env.DB_NAME || 'actus',[m
[32m+[m[32m  DB_COLLECTION: process.env.DB_COLLECTION || 'big5devtesting',[m
   URL: process.env.URL || 'http://localhost:3000'[m
 }[m
[1mdiff --git a/tests-app/production.env b/tests-app/production.env[m
[1mindex b750195..e7583f5 100644[m
[1m--- a/tests-app/production.env[m
[1m+++ b/tests-app/production.env[m
[36m@@ -1,4 +1,5 @@[m
 NODE_ENV=production[m
[31m-# DB_CONNECTION=@mongodb:27017/zoom[m
[31m-# DB_COLLECTION=big5results[m
[31m-URL=http://www.actus.com.ar/zoom/big5/[m
\ No newline at end of file[m
[32m+[m[32mDB_CONNECTION=mongodb+srv://abuteler:OOiYYk0RrX880xPX@cluster0.2p1xm.gcp.mongodb.net/actus?retryWrites=true&w=majority[m
[32m+[m[32mDB_NAME=actus[m
[32m+[m[32mDB_COLLECTION=big5results[m
[32m+[m[32mURL=http://www.actus.com.ar/tests/[m
\ No newline at end of file[m

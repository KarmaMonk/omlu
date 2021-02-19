Minimale Standalone OMLU Installation für das Modul STUEMTEC


#### Setup
   * https://exorciser.ch/di/ba20/stuemtec/setup-localhost-minimal

   * get your local webserver ready (incl. php)
   * clone the repository
   * edit your `.htaccess` to contain:
      ```Header always set Access-Control-Allow-Origin "*"
      RewriteEngine on
      RewriteBase /
      RewriteRule ^$ index.html [QSA,L]
      RewriteCond "%{REQUEST_FILENAME}"   !-f
      RewriteRule ^(.*) proxy.php?ref=$1 [QSA,L]
      ```
   * Open your app on `omlu.localhost/#[appname]`
   * Commit your changes

#### How to use
Start APP http://omlu.localhost/#plain 
Start App with Config http://gem.localhost/config.html#plain 


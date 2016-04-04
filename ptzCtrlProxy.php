<?php
	
	/**
	*	PTZ Controller Proxy
	*	use like ptzCtrlProxy.php?act=cmd
	*   where cmd can be 'up','down','left','right','stop'
	*/


    
    if((isset($_GET['ip']) && !empty($_GET['ip'])) && (isset($_GET['params']) && !empty($_GET['params'])) ){
        $ip = $_GET['ip'];
        $params = $_GET['params'];
        //url
		$URL="http://$ip/hy-cgi/ptz.cgi?".http_build_query($params);
		$handler = fopen('./proxy-error.log','w');
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $URL);
		curl_setopt($ch, CURLOPT_VERBOSE, true);
		curl_setopt($ch, CURLOPT_STDERR, $handler);
		curl_setopt($ch, CURLOPT_HEADER, true);
		curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_DIGEST);
		// Set login and password for authentication 
		curl_setopt($ch, CURLOPT_USERPWD, 'admin:123456');
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
 		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
 		curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)"); 
		$result = curl_exec($ch);
        print_r($result);
		curl_close($ch);


    }

?>
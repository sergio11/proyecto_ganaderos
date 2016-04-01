<?php
    error_reporting(0);
    date_default_timezone_set('Europe/Madrid');
    header('Content-Type: application/json');    

    $url = $_GET['url'];
    $file = "./tmp/camera.jpg";
    if (!filter_var($url, FILTER_VALIDATE_URL) === false) {
        $cmd = "ffmpeg -y -i $url -r 10 -f image2 $file";
        exec($cmd);
        $type = pathinfo($file, PATHINFO_EXTENSION);
        $data = file_get_contents($file);
        if(!$data){
            $result = array("error" => true);
        }else{
            //Convert Image To Data URI 
	        $result = array("dataUri" =>'data:image/' . $type . ';base64,' . base64_encode($data));
        }
        //Return JSON
	    echo json_encode($result);
    }

    
	
    


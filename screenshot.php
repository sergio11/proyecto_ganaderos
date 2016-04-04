<?php
    error_reporting(0);
    date_default_timezone_set('Europe/Madrid');
    header('Content-Type: application/json');    

    $ip = $_GET['ip'];
    $file = "./tmp/camera_frame_".mt_rand(5, 15).".jpg";
    exec("ffmpeg -y -i rtsp://admin:123456@$ip:554/live/ch0 -r 10 -f image2 $file");
    $type = pathinfo($file, PATHINFO_EXTENSION);
    $data = file_get_contents($file);
    if(!$data){
        $result = array("error" => true);
    }else{
        //Convert Image To Data URI 
	    $result = array("dataUri" =>'data:image/' . $type . ';base64,' . base64_encode($data));
    }
    unlink($file);
    //Return JSON
	echo json_encode($result);

    
	
    


<?php
date_default_timezone_set('Europe/Madrid');
header('Content-Type: application/json');

define("DIR_BASE_PATH",'./stream/640x480');
$images  = scandir(DIR_BASE_PATH,SCANDIR_SORT_DESCENDING);
if (sizeof($images) > 2) {
	//image path
	$image = DIR_BASE_PATH.DIRECTORY_SEPARATOR.array_shift($images);
	$type = pathinfo($image, PATHINFO_EXTENSION);
	$data = file_get_contents($image);
	//Convert Image To Data URI 
	$dataUri = 'data:image/' . $type . ';base64,' . base64_encode($data);
	//Return JSON
	echo json_encode(array("dataUri" => $dataUri));
}





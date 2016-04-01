<?php
    
	echo "Starting ffmpeg...\n\n";
	echo exec("ffmpeg -y -i rtsp://212.128.154.128:554/live/ch0 -r 10 -f image2 ./camera.jpg");
	echo "Done.\n";
?>
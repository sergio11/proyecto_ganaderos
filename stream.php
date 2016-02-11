<?php
/* script execution settings */
set_time_limit(0);

define('CHUNKSIZE', 500*1024); /* how many bytes should fread() read from stdout of FFmpeg? */

$file_path = ".\\stream\\640x480\\out_2.ogg";


$filehandler = fopen($file_path, "r");
fseek($filehandler, -CHUNKSIZE, SEEK_END);
while(true){
    $chunk = fread($filehandler, CHUNKSIZE);
    if ($chunk !== false && !empty($chunk)){
        echo $chunk;
        /* flush output */
        if (ob_get_length()){            
            @ob_flush();
            @flush();
            @ob_end_flush();
        }
        @ob_start();
                
    }
 
}

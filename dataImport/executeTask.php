<?php

require_once 'MuinaismuistotImport.php';

$importer = new MuinaismuistotImport();
$importer->start((int)$_GET['step']);
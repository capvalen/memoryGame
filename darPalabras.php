<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");


$server="localhost";

/* Net	*/
$username="zdoeobnk_infocat";
$password="1#)N?K+-m]R8";
$db = "zdoeobnk_juego";


$esclavo= new mysqli($server, $username, $password, $db);
$esclavo->set_charset("utf8");

//enviar por comas: 5,46,28,79
$idsPalabras = $_GET['palabras'];
$filas= [];

$sql="select *
from palabras
where idPalabra in ({$idsPalabras})";
$resultado=$esclavo->query($sql); $i=0;
while($row=$resultado->fetch_assoc()){ 
	$filas[$i] = $row;
	$i++;
}
echo json_encode($filas);

?>